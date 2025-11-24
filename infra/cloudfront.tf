# CloudFront distribution (optional, for production)
# Provides HTTPS, CDN, and custom domain support

resource "aws_cloudfront_origin_access_identity" "web_deployment" {
  count   = var.enable_cloudfront ? 1 : 0
  comment = "Origin access identity for ${var.bucket_name}"
}

resource "aws_cloudfront_distribution" "web_deployment" {
  count   = var.enable_cloudfront ? 1 : 0
  enabled = true

  origin {
    domain_name = aws_s3_bucket.web_deployment.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.web_deployment.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.web_deployment[0].cloudfront_access_identity_path
    }
  }

  aliases = var.domain_name != "" ? [var.domain_name] : []

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.web_deployment.id}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # SPA routing - serve index.html for 404s
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == ""
    acm_certificate_arn            = var.domain_name != "" ? var.acm_certificate_arn : null
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  tags = {
    Name        = "Chanakya Web CloudFront"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Update S3 bucket policy when CloudFront is enabled
resource "aws_s3_bucket_policy" "web_deployment_cloudfront" {
  count  = var.enable_cloudfront ? 1 : 0
  bucket = aws_s3_bucket.web_deployment.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "CloudFrontReadGetObject"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.web_deployment[0].iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.web_deployment.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.web_deployment]
}

# CloudFront outputs
output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = var.enable_cloudfront ? aws_cloudfront_distribution.web_deployment[0].id : null
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = var.enable_cloudfront ? aws_cloudfront_distribution.web_deployment[0].domain_name : null
}

output "cloudfront_url" {
  description = "CloudFront URL"
  value       = var.enable_cloudfront ? "https://${aws_cloudfront_distribution.web_deployment[0].domain_name}" : null
}
