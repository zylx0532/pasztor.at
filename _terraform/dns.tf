locals {
  domain_suffix = "${var.subdomain==""?"":".${var.subdomain}"}"
  zone_root = "${var.subdomain==""?"@":"${var.subdomain}"}"
}

resource "exoscale_domain_record" "service" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "A"
  content = "${exoscale_ipaddress.vip.ip_address}"
}

resource "exoscale_domain_record" "www" {
  domain = "${var.zone_name}"
  name = "www${local.domain_suffix}"
  record_type = "A"
  content = "${exoscale_ipaddress.vip.ip_address}"
}

resource "exoscale_domain_record" "monitoring" {
  domain = "${var.zone_name}"
  name = "monitoring${local.domain_suffix}"
  record_type = "A"
  content = "${exoscale_ipaddress.vip.ip_address}"
}

resource "exoscale_domain_record" "mx" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "MX"
  prio = "1"
  content = "ASPMX.L.GOOGLE.COM"
}

resource "exoscale_domain_record" "mx1" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "MX"
  prio = "5"
  content = "ALT1.ASPMX.L.GOOGLE.COM"
}

resource "exoscale_domain_record" "mx2" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "MX"
  prio = "5"
  content = "ALT2.ASPMX.L.GOOGLE.COM"
}

resource "exoscale_domain_record" "mx3" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "MX"
  prio = "10"
  content = "ALT3.ASPMX.L.GOOGLE.COM"
}

resource "exoscale_domain_record" "mx4" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "MX"
  prio = "10"
  content = "ALT4.ASPMX.L.GOOGLE.COM"
}

resource "exoscale_domain_record" "spf" {
  domain = "${var.zone_name}"
  name = "${local.zone_root}"
  record_type = "TXT"
  content = "v=spf1 include:_spf.google.com ~all"
}

resource "exoscale_domain_record" "dmarc" {
  domain = "${var.zone_name}"
  name = "_dmarc${local.domain_suffix}"
  record_type = "TXT"
  content = "v=DMARC1; p=none; sp=quarantine; aspf=s; adkim=s; ri=86400"
}

resource "exoscale_domain_record" "gverify" {
  domain = "${var.zone_name}"
  name = "mwaj4sbm7vgc${local.domain_suffix}"
  record_type = "CNAME"
  content = "gv-il2a7dcbusdnj4.dv.googlehosted.com"
}

resource "exoscale_domain_record" "status" {
  domain = "${var.zone_name}"
  name = "status${local.domain_suffix}"
  record_type = "CNAME"
  content = "stats.uptimerobot.com."
}