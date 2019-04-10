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
DEBIAN_FRONTEND=noninteractive apt-get install -y rsync htop tcpdump tcpflow
# endregion

# region SSH
sed -i -e 's/#Port 22/Port ${var.ssh_port}/' /etc/ssh/sshd_config
service ssh restart
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
    source = "../_docker/"
    destination = "/srv/docker/"
  }
  provisioner "remote-exec" {
    connection {
      user = "ubuntu"
      port = "${var.ssh_port}"
    }
    inline = [
      "set -e",
      "set -x",
      "export EXOSCALE_KEY=\"${var.exoscale_key}\"",
      "export EXOSCALE_SECRET=\"${var.exoscale_secret}\"",
      "cd /srv/docker",
      "sudo chown -R root:root .",
      "sudo docker-compose build",
      "sudo docker-compose up -d",
      "sudo userdel -f -r ubuntu"
    ]
  }

  depends_on = [
    "exoscale_security_group.web"
  ]
}