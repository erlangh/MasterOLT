@echo off
echo ========================================
echo SmartOLT Management - Local Test Script
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first.
    pause
    exit /b 1
)

echo [1/7] Checking Docker...
echo ✓ Docker is running

echo.
echo [2/7] Starting PostgreSQL container...
docker run --name smartolt-postgres -e POSTGRES_USER=smartolt -e POSTGRES_PASSWORD=smartolt123 -e POSTGRES_DB=smartolt_db -p 5432:5432 -d postgres:16-alpine >nul 2>&1
if errorlevel 1 (
    echo PostgreSQL container already exists, starting it...
    docker start smartolt-postgres >nul 2>&1
)
echo ✓ PostgreSQL is running

echo.
echo [3/7] Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul
echo ✓ PostgreSQL ready

echo.
echo [4/7] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [5/7] Setting up database schema...
call npx prisma generate
call npx prisma db push --skip-generate
if errorlevel 1 (
    echo [ERROR] Failed to push database schema
    pause
    exit /b 1
)
echo ✓ Database schema created

echo.
echo [6/7] Seeding database...
call npm run prisma:seed
if errorlevel 1 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)
echo ✓ Database seeded

echo.
echo [7/7] Starting development server...
echo.
echo ========================================
echo ✅ Setup Complete!
echo ========================================
echo.
echo Application will start at: http://localhost:3000
echo.
echo Default Admin Credentials:
echo   Email: admin@smartolt.com
echo   Password: Admin123!
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
