resource "aws_s3_bucket" "content" {
  bucket = "${var.content_bucket_name}"
  lifecycle {
    ignore_changes = [
      "object_lock_configuration"
    ]
  }
}

resource "aws_s3_bucket" "acme" {
  bucket = "${var.acme_bucket_name}"
  lifecycle {
    ignore_changes = [
      "object_lock_configuration"
    ]
  }
}


resource "aws_s3_bucket" "prometheus" {
  bucket = "${var.prometheus_bucket_name}"
  lifecycle {
    ignore_changes = [
      "object_lock_configuration"
    ]
  }
}

resource "null_resource" "site" {
  provisioner "local-exec" {
    environment {
      JEKYLL_ENV="prod"
    }
    working_dir = "../"
    command = "bundler exec jekyll build --future"
  }
  provisioner "local-exec" {
    working_dir = "../"
    command = "s3cmd sync --config=_terraform/s3.cfg --access_key=${var.exoscale_key} --secret_key=${var.exoscale_secret} --delete-removed ./_site/ s3://${var.content_bucket_name}"
  }
}

