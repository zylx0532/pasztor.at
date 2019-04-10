resource "tls_private_key" "initial" {
  algorithm = "RSA"
}

resource "exoscale_ssh_keypair" "initial" {
  name = "${local.domain_name}"
  public_key = "${tls_private_key.initial.public_key_openssh}"
}

output "initial_key" {
  value = "${tls_private_key.initial.private_key_pem}"
}