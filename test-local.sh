#!/bin/bash

echo "========================================"
echo "SmartOLT Management - Local Test Script"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running!"
    echo "Please start Docker first."
    exit 1
fi

echo "[1/7] Checking Docker..."
echo "✓ Docker is running"

echo ""
echo "[2/7] Starting PostgreSQL container..."
docker run --name smartolt-postgres \
  -e POSTGRES_USER=smartolt \
  -e POSTGRES_PASSWORD=smartolt123 \
  -e POSTGRES_DB=smartolt_db \
  -p 5432:5432 \
  -d postgres:16-alpine > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "PostgreSQL container already exists, starting it..."
    docker start smartolt-postgres > /dev/null 2>&1
fi
echo "✓ PostgreSQL is running"

echo ""
echo "[3/7] Waiting for PostgreSQL to be ready..."
sleep 5
echo "✓ PostgreSQL ready"

echo ""
echo "[4/7] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"

echo ""
echo "[5/7] Setting up database schema..."
npx prisma generate
npx prisma db push --skip-generate
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to push database schema"
    exit 1
fi
echo "✓ Database schema created"

echo ""
echo "[6/7] Seeding database..."
npm run prisma:seed
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to seed database"
    exit 1
fi
echo "✓ Database seeded"

echo ""
echo "[7/7] Starting development server..."
echo ""
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo ""
echo "Application will start at: http://localhost:3000"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@smartolt.com"
echo "  Password: Admin123!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
