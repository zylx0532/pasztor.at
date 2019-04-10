resource "aws_s3_bucket" "content" {
  bucket = "${var.content_bucket_name}"
}

resource "aws_s3_bucket" "acme_content" {
  bucket = "${var.acme_bucket_name}"
}
