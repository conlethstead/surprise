# GCP Deployment Guide

This guide will help you deploy your React application to Google Cloud Platform.

## Prerequisites

1. **Google Cloud SDK**: Install the gcloud CLI
   ```bash
   # macOS
   brew install --cask google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authentication**: Log in to your Google Cloud account
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Docker**: Make sure Docker is installed and running

## Deployment Options

### Option 1: Automated Deployment (Recommended)

Run the deployment script:
```bash
./deploy.sh
```

This script will:
- Set the correct GCP project
- Enable required APIs
- Build and push the Docker image to Google Container Registry
- Deploy to Cloud Run
- Provide you with the public URL

### Option 2: Manual Deployment

If you prefer to run commands manually:

1. **Set your project**:
   ```bash
   gcloud config set project surprise-473700
   ```

2. **Enable APIs**:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Build and push image**:
   ```bash
   gcloud builds submit --tag gcr.io/surprise-473700/surprise-app:latest .
   ```

4. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy surprise-app \
     --image gcr.io/surprise-473700/surprise-app:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 80 \
     --memory 512Mi \
     --cpu 1 \
     --max-instances 10
   ```

## Configuration

- **Region**: us-central1 (you can change this in deploy.sh)
- **Memory**: 512Mi
- **CPU**: 1 vCPU
- **Max instances**: 10
- **Port**: 80 (nginx default)

## Custom Domain (Optional)

To use a custom domain:
```bash
gcloud run domain-mappings create \
  --service=surprise-app \
  --domain=your-domain.com \
  --region=us-central1
```

## Monitoring

View logs:
```bash
gcloud logs tail --service surprise-app
```

## Troubleshooting

1. **Authentication issues**: Run `gcloud auth login` and `gcloud auth application-default login`
2. **API not enabled**: The script automatically enables required APIs
3. **Billing**: Make sure billing is enabled for your project
4. **Permissions**: Ensure you have Cloud Run Admin and Storage Admin roles

## Cost Optimization

Cloud Run charges only for actual usage:
- First 2 million requests per month are free
- $0.40 per million requests after that
- $0.000024 per vCPU-second and $0.0000025 per GiB-second for memory

Your app will scale to zero when not in use, so you only pay for active usage.