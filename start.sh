#!/bin/bash

echo "Starting SmartOLT Management Application..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Run Prisma migrations
echo "Running database migrations..."
docker-compose exec app npx prisma db push

# Run database seed
echo "Seeding database..."
docker-compose exec app npm run prisma:seed

echo ""
echo "✅ SmartOLT Management Application is running!"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Default credentials:"
echo "  Email: admin@smartolt.com"
echo "  Password: Admin123!"
echo ""
echo "To view logs: docker-compose logs -f app"
echo "To stop: docker-compose down"
