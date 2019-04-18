resource "uptimerobot_monitor" "main" {
  friendly_name = "${var.server_hostname}.${var.server_domain}"
  type          = "http"
  url           = "https://${var.server_hostname}.${var.server_domain}"
  interval      = 300

  depends_on = ["exoscale_compute.web"]
}

resource "uptimerobot_monitor" "monitoring" {
  friendly_name = "monitoring.${var.server_hostname}.${var.server_domain}"
  type          = "http"
  url           = "https://monitoring.${var.server_hostname}.${var.server_domain}"
  interval      = 300
  alert_contact {
    id = "${uptimerobot_alert_contact.victorops.id}"
  }

  depends_on = ["exoscale_compute.web"]
}

resource "uptimerobot_alert_contact" "victorops" {
  friendly_name = "VictorOps"
  type          = "webhook"
  value         = "${var.uptimerobot_victorops_url}"
}

resource "uptimerobot_status_page" "main" {
  friendly_name  = "${var.server_hostname}.${var.server_domain} status"
  custom_domain  = "status.${var.server_hostname}.${var.server_domain}"
  monitors       = [
    "${uptimerobot_monitor.main.id}",
    "${uptimerobot_monitor.monitoring.id}"
  ]
}
