resource "exoscale_secondary_ipaddress" "ingress_ip" {
  compute_id = "${exoscale_compute.web.id}"
  ip_address = "${exoscale_ipaddress.vip.ip_address}"

  lifecycle {
    create_before_destroy = true
  }
}