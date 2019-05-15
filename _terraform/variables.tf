variable "exoscale_key" {}
variable "exoscale_secret" {}
variable "content_bucket_name" {}
variable "acme_bucket_name" {}
variable "prometheus_bucket_name" {}
variable "image" {
  default = "Linux Ubuntu 18.04 LTS 64-bit"
}
variable "instance_type" {
  default = "Small"
}

variable "instance_disk" {
  default = 50
}
variable "zone_name" {}
variable "subdomain" {
  default = ""
}

variable "ssh_port" {
  default = 12222
}

variable "server_hostname" {

}

variable "server_domain" {

}

variable "ssh_key_janoszen" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDVyqES0hSM9DpByBn3dRJQQjeFPEFtb670p5eiz2Vk8LFTowMJoriIdFOpqC0jyxRaZ88rNh8oA1X14XBB3UEM3kB/vZIwrc6vB7gFA4aZm/7O9fv80SEh7d0xJSAxVTGSUjuaU6yFRsIWgqfYU+JhouG2XByeD5insHVEHbyhNKs7Ba0T8Ehl4HUAmOMIh1zTkw/mZsgb056aPiPALvwUt280CARwjpZUIn2bE8R4gv8DB2vKJHqaGSKCKey38RP1xjg5Ygs/QO9otIU58YuDS0hgHsj5aLY7ksfAfH7op6fj3L13oLS3C2eFzdjumFf09kUOU7Mjqv8cyvYujzvNMpjt/BW5ebICNlmZ2tYTcAIpRMroKmJ9k9uZmvuhYdNIxD4B5egjw9c+aogDFhqsGa/FcyEzxHHqMoI7QMqw4sfScI3CuYAULLdJJ/5fcBC22tnB6odZtvgUGdbrCrvp5/Gza5yaibaTqtBS+PqfM+191vC6vmc0e3foE2jfGbf3DLSfJqaQxf+UMenI4L9JiAixG51GVz7cUN0cyHmjYWdtzjPRa8C+vYrjCjzxIvJ9eDB0zMOTgEy7bmr1HN/zIEs09/bw5KxqpjPafpwFEPiQxGQlhwwiUeRQbbpSqA5TeQQIm3x5Jr5oa6ROeFNdeEQYCOQMtKVdzUxI9Kk1vQ== janoszen@janoszen-laptop"
}

locals {
  domain_name = "${var.subdomain==""?"":"${var.subdomain}."}${var.zone_name}"
}

variable "github_client_id" {}
variable "github_client_secret" {}
variable "grafana_secret_key" {}
variable "grafana_victorops_url" {}
variable "uptimerobot_api_key" {}

variable "uptimerobot_victorops_url" {}