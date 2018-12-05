variable "name" {
  type = "string"
  description = "Node name"
}

variable "region" {
  type = "string"
  description = "AWS region"
}

provider "aws" {
  region = "${var.region}"
}

resource "aws_lightsail_key_pair" "key" {
  name       = "id_rsa"
  public_key = "${file("~/.ssh/id_rsa.pub")}"
}

resource "aws_lightsail_instance" "instance" {
  name = "cdn-${var.region}"
  availability_zone = "${var.region}a"
  blueprint_id = "ubuntu_16_04_1"
  bundle_id = "nano_1_0"
  key_pair_name = "${aws_lightsail_key_pair.key.name}"
}

resource "aws_lightsail_static_ip" "ip" {
  name = "${var.region}.cdn.opsbears.net"
}

resource "aws_lightsail_static_ip_attachment" "attachment" {
  instance_name = "${aws_lightsail_instance.instance.name}"
  static_ip_name = "${aws_lightsail_static_ip.ip.name}"
}

resource "aws_route53_record" "pop" {
  name = "${var.name}.cdn.opsbears.net."
  type = "A"
  zone_id = "Z2XTLEELQKM14W"
  ttl = 300
  records = [
    "${aws_lightsail_static_ip.ip.ip_address}"
  ]
}

resource "aws_route53_health_check" "check" {
  ip_address = "${aws_lightsail_static_ip.ip.ip_address}"
  fqdn = "pasztor.at"
  port = 443
  type = "HTTPS"
  resource_path     = ""
  failure_threshold = "3"
  request_interval  = "30"
  enable_sni = true
  tags = {
    Name = "${var.name}.cdn.opsbears.net"
  }
}

resource "aws_route53_record" "target" {
  name = "pasztor.at"
  type = "A"
  zone_id = "ZUHMK8NABN9AI"
  health_check_id = "${aws_route53_health_check.check.id}"
  set_identifier = "latency-${var.name}"
  ttl = 60
  latency_routing_policy {
    region = "${var.region}"
  }
  records = [
    "${aws_lightsail_static_ip.ip.ip_address}"
  ]
}

resource "aws_route53_record" "www" {
  name = "www.pasztor.at"
  type = "A"
  zone_id = "ZUHMK8NABN9AI"
  health_check_id = "${aws_route53_health_check.check.id}"
  set_identifier = "latency-${var.name}"
  ttl = 60
  latency_routing_policy {
    region = "${var.region}"
  }
  records = [
    "${aws_lightsail_static_ip.ip.ip_address}"
  ]
}

output "ip" {
  value = "${aws_lightsail_static_ip.ip.ip_address}"
}

output "fqdn" {
  value = "${aws_route53_record.pop.fqdn}"
}
