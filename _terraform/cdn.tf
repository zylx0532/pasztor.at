terraform {
  backend "s3" {
    bucket = "opsbears-cdn-terraform"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}

module "eu-central-1" {
  source = "lightsail"
  name   = "eu-central-1"
  region = "eu-central-1"
}

module "eu-west-2" {
  source = "lightsail"
  name   = "eu-west-2"
  region = "eu-west-2"
}


module "ap-south-1" {
  source = "lightsail"
  name   = "ap-south-1"
  region = "ap-south-1"
}

module "us-east-1" {
  source = "lightsail"
  name   = "us-east-1"
  region = "us-east-1"
}

module "us-east-2" {
  source = "lightsail"
  name   = "us-east-2"
  region = "us-east-2"
}

module "ap-southeast-1" {
  source = "lightsail"
  name   = "ap-southeast-1"
  region = "ap-southeast-1"
}

module "ap-northeast-1" {
  source = "lightsail"
  name   = "ap-northeast-1"
  region = "ap-northeast-1"
}

module "us-west-2" {
  source = "lightsail"
  name   = "us-west-2"
  region = "us-west-2"
}

module "ap-southeast-2" {
  source = "lightsail"
  name   = "ap-southeast-2"
  region = "ap-southeast-2"
}

module "us-west-1" {
  source = "ec2"
  name   = "us-west-1"
  region = "us-west-1"
}

module "sa-east-1" {
  source = "ec2"
  name   = "sa-east-1"
  region = "sa-east-1"
}

resource "aws_route53_record" "all" {
  name = "all.cdn.opsbears.net."
  type = "A"
  zone_id = "Z2XTLEELQKM14W"
  ttl = 300
  records = [
    "${module.eu-central-1.ip}",
    "${module.ap-northeast-1.ip}",
    "${module.ap-south-1.ip}",
    "${module.ap-southeast-1.ip}",
    "${module.ap-southeast-2.ip}",
    "${module.eu-west-2.ip}",
    "${module.sa-east-1.ip}",
    "${module.us-east-1.ip}",
    "${module.us-east-2.ip}",
    "${module.us-west-1.ip}",
    "${module.us-west-2.ip}"
  ]
}
