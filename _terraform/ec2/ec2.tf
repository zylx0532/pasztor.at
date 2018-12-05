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

resource "aws_key_pair" "key" {
  key_name = "id_rsa"
  public_key = "${file("~/.ssh/id_rsa.pub")}"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "instance" {
  ami = "${data.aws_ami.ubuntu.id}"
  availability_zone = "${var.region}a"
  key_name = "${aws_key_pair.key.key_name}"
  instance_type = "t2.nano"
  tags {
    Name = "cdn-${var.region}"
  }
}

resource "aws_eip" "ip" {
  instance = "${aws_instance.instance.id}"
  tags {
    Name = "${var.region}.cdn.opsbears.net"
  }
}

resource "aws_route53_record" "pop" {
  name = "${var.name}.cdn.opsbears.net."
  type = "A"
  zone_id = "Z2XTLEELQKM14W"
  ttl = 300
  records = [
    "${aws_eip.ip.public_ip}"
  ]
}

resource "aws_route53_health_check" "check" {
  ip_address = "${aws_eip.ip.public_ip}"
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
    "${aws_eip.ip.public_ip}"
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
    "${aws_eip.ip.public_ip}"
  ]
}

output "ip" {
  value = "${aws_eip.ip.public_ip}"
}
