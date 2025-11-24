output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.web_deployment.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.web_deployment.arn
}

output "website_endpoint" {
  description = "S3 website endpoint"
  value       = aws_s3_bucket_website_configuration.web_deployment.website_endpoint
}

output "website_url" {
  description = "Full website URL"
  value       = "http://${aws_s3_bucket_website_configuration.web_deployment.website_endpoint}"
}

output "bucket_regional_domain_name" {
  description = "Regional domain name of the bucket"
  value       = aws_s3_bucket.web_deployment.bucket_regional_domain_name
}

output "deployment_commands" {
  description = "Commands to deploy the web app"
  value = <<-EOT
    # Build the Expo web app
    cd /Users/sagar/IdeaProjects/chanakya/chanakya-ui
    npx expo export -p web

    # Deploy to S3
    aws s3 sync dist/ s3://${aws_s3_bucket.web_deployment.id}/ --delete

    # Access the website at:
    http://${aws_s3_bucket_website_configuration.web_deployment.website_endpoint}
  EOT
}
