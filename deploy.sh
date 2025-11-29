#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to script directory
cd "$(dirname "$0")"

echo -e "${YELLOW}🚀 Starting Chanakya UI Deployment${NC}\n"

# Step 1: Build the Expo web app
echo -e "${YELLOW}📦 Building Expo web app...${NC}"
npx expo export -p web

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed${NC}\n"

# Step 2: Get bucket name from Terraform
echo -e "${YELLOW}🔍 Getting S3 bucket name...${NC}"
cd infra

if [ ! -f "terraform.tfstate" ]; then
    echo -e "${RED}❌ Terraform state not found. Run 'terraform apply' first.${NC}"
    exit 1
fi

BUCKET_NAME=$(terraform output -raw bucket_name 2>/dev/null)

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Could not get bucket name from Terraform${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Bucket: $BUCKET_NAME${NC}\n"

# Step 3: Deploy to S3
echo -e "${YELLOW}☁️  Deploying to S3...${NC}"
cd ..
aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployed to S3${NC}\n"
else
    echo -e "${RED}❌ S3 deployment failed${NC}"
    exit 1
fi

# Step 4: Get website URL
cd infra
WEBSITE_URL=$(terraform output -raw website_url 2>/dev/null)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null)

# Step 5: Invalidate CloudFront cache if enabled
if [ "$CLOUDFRONT_ID" != "null" ] && [ ! -z "$CLOUDFRONT_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_ID} \
        --paths "/*" \
        --output text > /dev/null

    CLOUDFRONT_URL=$(terraform output -raw cloudfront_url 2>/dev/null)
    echo -e "${GREEN}✓ CloudFront cache invalidated${NC}\n"
    echo -e "${GREEN}✨ Deployment complete!${NC}"
    echo -e "${GREEN}🌐 CloudFront URL: $CLOUDFRONT_URL${NC}"
    echo -e "${YELLOW}⏱️  Note: CloudFront invalidation may take 5-10 minutes${NC}"
else
    echo -e "${GREEN}✨ Deployment complete!${NC}"
    echo -e "${GREEN}🌐 Website URL: $WEBSITE_URL${NC}"
fi

echo ""
