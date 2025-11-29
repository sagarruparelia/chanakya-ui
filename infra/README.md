# Chanakya UI Deployment Infrastructure

Terraform configuration for deploying the Expo web app to AWS S3.

## Features

- **S3 bucket** for static website hosting
- **Versioning** enabled for rollback capability
- **CORS** configuration for API calls
- **Lifecycle policies** to clean up old versions
- **CloudFront CDN** (optional) for production with HTTPS and custom domain

## Prerequisites

1. AWS CLI configured with credentials
2. Terraform >= 1.0 installed
3. S3 bucket `chanakya-terraform-state` for state storage

## Quick Start

### 1. Initialize Terraform

```bash
cd /Users/sagar/IdeaProjects/chanakya/chanakya-ui/infra
terraform init
```

### 2. Create terraform.tfvars

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 3. Plan and Apply

```bash
# Review changes
terraform plan

# Apply configuration
terraform apply
```

### 4. Deploy Your Web App

```bash
# Build Expo web app
cd /Users/sagar/IdeaProjects/chanakya/chanakya-ui
npx expo export -p web

# Deploy to S3
aws s3 sync dist/ s3://chanakya-web-app-dev/ --delete

# Get the website URL
terraform output website_url
```

## Configuration Options

### Basic S3 Website (Development)

```hcl
# terraform.tfvars
aws_region  = "ap-south-1"
environment = "dev"
bucket_name = "chanakya-web-app-dev"
```

**Cost**: ~$0.023/GB/month for storage + minimal request costs

### With CloudFront CDN (Production)

```hcl
# terraform.tfvars
aws_region        = "ap-south-1"
environment       = "prod"
bucket_name       = "chanakya-web-app-prod"
enable_cloudfront = true
```

**Cost**: ~$0.085/GB data transfer + $0.60/month minimum

### With Custom Domain (Production)

```hcl
# terraform.tfvars
aws_region          = "ap-south-1"
environment         = "prod"
bucket_name         = "chanakya-web-app-prod"
enable_cloudfront   = true
domain_name         = "app.chanakya.in"
acm_certificate_arn = "arn:aws:acm:us-east-1:xxx:certificate/xxx"
```

**Note**: ACM certificate must be created in `us-east-1` region for CloudFront.

## Deployment Script

Create a deployment script `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "Building Expo web app..."
npx expo export -p web

echo "Deploying to S3..."
BUCKET_NAME=$(cd infra && terraform output -raw bucket_name)
aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete

echo "Deployment complete!"

# Get website URL
cd infra && terraform output website_url

# If CloudFront is enabled, invalidate cache
if [ "$(terraform output -raw cloudfront_distribution_id 2>/dev/null)" != "null" ]; then
  DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
  echo "Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id ${DISTRIBUTION_ID} \
    --paths "/*"
fi
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Outputs

After applying, Terraform provides:

- `bucket_name` - S3 bucket name
- `website_url` - Direct S3 website URL
- `cloudfront_url` - CloudFront URL (if enabled)
- `deployment_commands` - Quick deployment guide

## Cost Estimation

### Development (S3 only)
- Storage: $0.023/GB/month
- PUT requests: $0.005 per 1,000
- GET requests: $0.0004 per 1,000
- **Example**: 500MB app = ~$0.01/month

### Production (S3 + CloudFront)
- Storage: Same as above
- CloudFront data transfer: $0.085/GB
- CloudFront requests: $0.0075 per 10,000
- **Example**: 10,000 monthly users = ~$5-10/month

## Cleanup

To destroy all resources:

```bash
cd infra
terraform destroy
```

## Troubleshooting

### Error: Backend initialization required

```bash
terraform init -reconfigure
```

### Error: Bucket policy conflicts

Wait 1-2 minutes after creating bucket before applying policy.

### CloudFront not using latest files

Create invalidation:
```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

## CORS Configuration

The infrastructure is configured to allow cross-origin resource sharing:

### S3 CORS Rules

- **Allowed Origins**: `*` (all domains)
- **Allowed Methods**: `GET`, `HEAD`, `OPTIONS`, `POST`, `PUT`
- **Allowed Headers**: All
- **Exposed Headers**: `ETag`, `Content-Length`, `Content-Type`, `Access-Control-Allow-Origin`

### CloudFront CORS (when enabled)

- CloudFront forwards CORS headers from S3
- Response headers policy ensures proper CORS headers
- OPTIONS requests are cached for performance

### Testing CORS

From an external domain's console:

```javascript
// Test loading a JS file
fetch('https://your-bucket.s3.ap-south-1.amazonaws.com/main.js')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);

// Test with explicit origin
fetch('https://your-bucket.s3.ap-south-1.amazonaws.com/main.js', {
  mode: 'cors',
  headers: {
    'Origin': 'https://external-domain.com'
  }
})
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

### Using with `<script>` tags

External websites can load your JS files directly:

```html
<!-- From any external domain -->
<script src="https://your-bucket.s3.ap-south-1.amazonaws.com/bundle.js"></script>
<script src="https://your-bucket.s3.ap-south-1.amazonaws.com/main.js"></script>
```

### Restricting to Specific Domains (Optional)

To limit CORS to specific domains, modify `main.tf`:

```hcl
cors_rule {
  allowed_origins = [
    "https://example.com",
    "https://www.example.com",
    "https://partner-site.com"
  ]
  # ... rest of config
}
```

## Security Notes

- S3 bucket has public read access for website hosting
- CloudFront uses OAI (Origin Access Identity) for better security
- HTTPS is enforced when CloudFront is enabled
- Old versions are automatically deleted after 30 days
- CORS is configured to allow all origins (can be restricted)
- Security headers included (XSS protection, frame options, etc.)
