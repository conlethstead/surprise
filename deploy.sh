#!/bin/bash

# GCP Deployment Script for Surprise App
# Usage: ./deploy.sh

set -e

# Configuration
PROJECT_ID="surprise-473700"
SERVICE_NAME="surprise-app"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Starting deployment to GCP..."

# Check if gcloud CLI is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting GCP project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push Docker image
echo "🏗️  Building and pushing Docker image..."
gcloud builds submit --tag ${IMAGE_NAME}:latest .

# Deploy to Cloud Run
echo "☁️  Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform managed --region ${REGION} --format 'value(status.url)')

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is available at: ${SERVICE_URL}"

# Optional: Set up custom domain (uncomment if needed)
# echo "🔗 To set up a custom domain, run:"
# echo "gcloud run domain-mappings create --service=${SERVICE_NAME} --domain=your-domain.com --region=${REGION}"