#!/bin/bash
# Deployment script for LLM Council

set -e

echo "🚀 Starting LLM Council deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file with ZENMUX_API_KEY"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Create data directory if not exists
echo "📁 Creating data directory..."
mkdir -p data/conversations

# Build and start Docker containers
echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "✅ Checking service status..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Application is running at:"
echo "  - HTTP: http://localhost"
echo "  - Backend API: http://localhost:8008"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
