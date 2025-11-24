terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "chanakya-terraform-state"
    key    = "ui-deployment/terraform.tfstate"
    region = "ap-south-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for static website hosting
resource "aws_s3_bucket" "web_deployment" {
  bucket = var.bucket_name

  tags = {
    Name        = "Chanakya Web Deployment"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Enable versioning for rollback capability
resource "aws_s3_bucket_versioning" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Configure bucket for static website hosting
resource "aws_s3_bucket_website_configuration" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"  # SPA routing fallback
  }
}

# Block public access settings (we'll use CloudFront instead)
resource "aws_s3_bucket_public_access_block" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  block_public_acls       = true
  block_public_policy     = false  # Allow bucket policy
  ignore_public_acls      = true
  restrict_public_buckets = false  # Allow public bucket policy
}

# Bucket policy for public read access
resource "aws_s3_bucket_policy" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.web_deployment.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.web_deployment]
}

# CORS configuration for API calls
resource "aws_s3_bucket_cors_configuration" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Lifecycle policy to clean up old versions
resource "aws_s3_bucket_lifecycle_configuration" "web_deployment" {
  bucket = aws_s3_bucket.web_deployment.id

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}
