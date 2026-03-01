#!/bin/bash
#use this one to deploy in google cloud
# Deployment script for Next.js application to Google Cloud Run
# This script uses Google Cloud Build to build the Docker image
# and deploy it to Cloud Run

set -e

# Configuration - CHANGE THESE VALUES
PROJECT_ID="text-to-voice-two-people" # Your Google Cloud project ID
SERVICE_NAME="nextjs-blog-post-card" # Name for your Cloud Run service
REGION="us-central1" # Region to deploy to
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting Docker-based deployment to Google Cloud Run..."

# Step 1: Set the project
echo "📋 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Step 2: Enable required APIs
echo "🔧 Enabling required Google Cloud APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Step 3: Clean any unnecessary files
echo "🧹 Cleaning unnecessary files..."
rm -rf .next

# Step 4: Submit the build to Cloud Build
echo "🏗️ Building Docker image with Cloud Build..."
gcloud builds submit --tag $IMAGE_NAME

# Step 5: Deploy the container to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

echo "✅ Deployment completed!"
echo ""
echo "🌐 Your website should now be available at the URL above."
echo ""
echo "📊 To check service status:"
echo "   gcloud run services describe $SERVICE_NAME --region $REGION"
echo ""
echo "📝 To view service logs:"
echo "   gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME\" --project $PROJECT_ID --limit 50"
