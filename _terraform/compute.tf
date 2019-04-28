data "archive_file" "docker" {
  type        = "zip"
  output_path = "${path.module}/docker.zip"

  source_dir = "docker/"
}

data "template_file" "victorops" {
  template = "${file("victorops.yaml.j2")}"
  vars {
    grafana_victorops_url = "${var.grafana_victorops_url}"
  }
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
DEBIAN_FRONTEND=noninteractive apt-get install -y rsync htop tcpdump tcpflow unzip mc
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
echo '${tls_private_key.web-ecdsa.private_key_pem}' >/etc/ssh/ssh_host_ecdsa_key
echo '${tls_private_key.web-rsa.private_key_pem}' >/etc/ssh/ssh_host_rsa_key
rm /etc/ssh/ssh_host_dsa_key
rm /etc/ssh/ssh_host_ed25519_key
sed -i -e 's/#HostKey \/etc\/ssh\/ssh_host_dsa_key//' /etc/ssh/sshd_config
sed -i -e 's/#HostKey \/etc\/ssh\/ssh_host_ed25519_key//' /etc/ssh/sshd_config
sed -i -e 's/#HostKey \/etc\/ssh\/ssh_host_rsa_key/HostKey \/etc\/ssh\/ssh_host_rsa_key/' /etc/ssh/sshd_config
sed -i -e 's/#HostKey \/etc\/ssh\/ssh_host_ecdsa_key/HostKey \/etc\/ssh\/ssh_host_ecdsa_key/' /etc/ssh/sshd_config
sed -i -e 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
echo '${tls_locally_signed_cert.web-ecdsa.cert_pem}' >/etc/ssh/ssh_host_ecdsa_cert
echo '${tls_locally_signed_cert.web-rsa.cert_pem}' >/etc/ssh/ssh_host_rsa_cert
echo '${tls_self_signed_cert.ca.cert_pem}' >/etc/ssh/ssh_ca_cert
echo 'HostCertificate /etc/ssh/ssh_host_ecdsa_cert' >>/etc/ssh/sshd_config
echo 'HostCertificate /etc/ssh/ssh_host_rsa_cert' >>/etc/ssh/sshd_config
sed -i -e 's/#Port 22/Port ${var.ssh_port}/' /etc/ssh/sshd_config
# endregion

# region Reboot
reboot --reboot
# endregion
EOF

  provisioner "remote-exec" {
    connection {
      agent = false
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
    }
    script = "install-docker.sh"
  }
  provisioner "file" {
    connection {
      agent = false
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
    }
    source = "${data.archive_file.docker.output_path}"
    destination = "/srv/docker/docker.zip"
  }
  provisioner "remote-exec" {
    connection {
      agent = false
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
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
      agent = false
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
    }
    content = "${data.template_file.victorops.rendered}"
    destination = "/srv/docker/images/grafana/root/etc/grafana/provisioning/notifiers/victorops.yaml"
  }
  provisioner "file" {
    connection {
      agent = false
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
    }
    content = <<EOF
#!/bin/bash

set -x
set -e

export EXOSCALE_KEY="${var.exoscale_key}"
export EXOSCALE_SECRET="${var.exoscale_secret}"
export GITHUB_CLIENT_ID="${var.github_client_id}"
export GITHUB_CLIENT_SECRET="${var.github_client_secret}"
export ACME_BUCKET_NAME="${aws_s3_bucket.acme.bucket}"
export PROMETHEUS_BUCKET_NAME="${aws_s3_bucket.prometheus.bucket}"
export GRAFANA_BUCKET_NAME="${aws_s3_bucket.grafana.bucket}"
export EXOSCALE_REGION="at-vie-1"
export DOMAIN="${local.domain_name}"
export CONTENT_BUCKET_NAME="${var.content_bucket_name}"
export GRAFANA_SECRET_KEY="${var.grafana_secret_key}"
cd /srv/docker
docker-compose build
docker-compose up -d
EOF
    destination = "/srv/docker/start.sh"
  }
  provisioner "remote-exec" {
    connection {
      type = "ssh"
      user = "ubuntu"
      port = "${var.ssh_port}"
      private_key = "${tls_private_key.initial.private_key_pem}"
      #TODO: replace with certificate when 0.12 comes out
      host_key = "${tls_private_key.web-rsa.public_key_openssh}"
    }
    inline = [
      "set -e",
      "set -x",
      "sudo mkdir -p /srv/grafana",
      "sudo chmod 0777 /srv/grafana",
      "sudo mkdir -p /srv/prometheus",
      "sudo chmod 0777 /srv/prometheus",
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