data "archive_file" "docker" {
  type        = "zip"
  output_path = "${path.module}/docker.zip"

  source_dir = "docker/"
}

resource "exoscale_compute" "web" {
  display_name = "${var.server_hostname}"
  template = "${var.image}"
  size = "${var.instance_type}"
  disk_size = "${var.instance_disk}"
  key_pair = "${exoscale_ssh_keypair.initial.name}"
  state = "Running"
  zone = "at-vie-1"

  security_groups = ["${exoscale_security_group.web.name}"]
  ip6 = true

  user_data = <<EOF
#!/bin/bash

#region Users
function create_user() {
  useradd -m -s /bin/bash $$1
  mkdir -p /home/$$1/.ssh
  echo "$$2" >/home/$$1/.ssh/authorized_keys
  chown -R $$1:$$1 /home/$$1
  gpasswd -a $$1 sudo
  gpasswd -a $$1 adm
}

sed -i -e 's/%sudo\s*ALL=(ALL:ALL)\s*ALL/%sudo ALL=(ALL:ALL) NOPASSWD:ALL/' /etc/sudoers
create_user janoszen "${var.ssh_key_janoszen}"
#endregion

# region Updates
DEBIAN_FRONTEND=noninteractive apt-get update
DEBIAN_FRONTEND=noninteractive apt-get -o Dpkg::Options::="--force-confnew" --force-yes -fuy upgrade
DEBIAN_FRONTEND=noninteractive apt-get -o Dpkg::Options::="--force-confnew" --force-yes -fuy dist-upgrade
DEBIAN_FRONTEND=noninteractive apt-get install -y rsync htop tcpdump tcpflow unzip
# endregion

# region Network
echo 'network: {config: disabled}' >/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg
echo 'network:
    version: 2
    ethernets:
        eth0:
            dhcp4: true
            dhcp6: false
            addresses:
              - ${exoscale_ipaddress.vip.ip_address}/32
' >/etc/netplan/01-eth0.yaml
# endregion

# region SSH
sed -i -e 's/#Port 22/Port ${var.ssh_port}/' /etc/ssh/sshd_config
# endregion

# region Reboot
reboot --reboot
# endregion
EOF

  provisioner "remote-exec" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    script = "install-docker.sh"
  }
  provisioner "file" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    source = "${data.archive_file.docker.output_path}"
    destination = "/srv/docker/docker.zip"
  }
  provisioner "remote-exec" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    inline = [
      "set -e",
      "set -x",
      "cd /srv/docker",
      "unzip docker.zip",
    ]
  }
  provisioner "file" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    content = <<EOF
#!/bin/bash

set -x
set -e

export EXOSCALE_KEY="${var.exoscale_key}"
export EXOSCALE_SECRET="${var.exoscale_secret}"
export ACME_BUCKET_NAME="${var.acme_bucket_name}"
export EXOSCALE_REGION="at-vie-1"
export DOMAIN="${local.domain_name}"
export CONTENT_BUCKET_NAME="${var.content_bucket_name}"
cd /srv/docker
docker-compose build
docker-compose up -d
EOF
    destination = "/srv/docker/start.sh"
  }
  provisioner "remote-exec" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    inline = [
      "set -e",
      "set -x",
      "sudo chown -R root:root .",
      "sudo chmod +x /srv/docker/start.sh",
      "sudo /srv/docker/start.sh",
      "sudo userdel -f -r ubuntu"
    ]
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    "exoscale_security_group.web",
    "null_resource.site"
  ]
}