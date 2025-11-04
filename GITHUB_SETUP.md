# 🚀 Setup dari GitHub Repository (smartolt-app)

## 📦 Clone Repository

### Di Komputer Lokal (Windows)

```bash
# Clone repository
git clone https://github.com/erlangh/smartolt-app.git
cd smartolt-app

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

:: Opsi A (Default): SQLite — tidak perlu Postgres
:: Langsung generate dan push schema

:: Opsi B (PostgreSQL): Jika ingin pakai Postgres
:: docker run --name smartolt-postgres ^
::   -e POSTGRES_USER=smartolt ^
::   -e POSTGRES_PASSWORD=smartolt123 ^
::   -e POSTGRES_DB=smartolt_db ^
::   -p 5432:5432 ^
::   -d postgres:16-alpine

:: Setup database (SQLite default)
npx prisma generate
npx prisma db push

# Seed database
npm run prisma:seed

# Run development server
npm run dev
```

### Di Komputer Lokal (Linux/Mac)

```bash
git clone https://github.com/erlangh/smartolt-app.git
cd smartolt-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

## Opsi B (PostgreSQL)
# Jika ingin pakai Postgres
# docker run --name smartolt-postgres \
#   -e POSTGRES_USER=smartolt \
#   -e POSTGRES_PASSWORD=smartolt123 \
#   -e POSTGRES_DB=smartolt_db \
#   -p 5432:5432 \
#   -d postgres:16-alpine

## Setup database (SQLite default)
npx prisma generate
npx prisma db push

# Seed database
npm run prisma:seed

# Run development server
npm run dev
```

## 🌐 Deploy ke VPS Ubuntu 22.04

### 1. Login ke VPS

```bash
ssh user@your-vps-ip
```

### 2. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Install Git
sudo apt install git -y
```

### 3. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/erlangh/smartolt-app.git smartolt
cd smartolt

# Set permissions
sudo chown -R $USER:$USER /opt/smartolt
```

### 4. Configure Environment

```bash
# Copy dan edit .env
cp .env.example .env
nano .env
```

Update konfigurasi (SQLite default):
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://your-domain.com"  # atau http://your-vps-ip:3000
NEXTAUTH_SECRET="generate-32-char-random-string"
NODE_ENV="production"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Menjalankan dengan Docker Compose

```bash
nano docker-compose.yml
```

Opsi A (default SQLite, menarik image dari GHCR):
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Opsi B (PostgreSQL):
```bash
docker-compose up -d --build
```

### 6. Deploy dengan Docker

```bash
# Build dan start
docker-compose up -d --build

# Wait for containers
sleep 10

## Setup database (pertama kali)
docker-compose -f docker-compose.prod.yml exec app npx prisma db push
docker-compose -f docker-compose.prod.yml exec app npm run prisma:seed
```

### 7. Verify Deployment

```bash
# Check containers
docker-compose ps

# Check logs
docker-compose logs -f app

# Test application
curl http://localhost:3000
```

## 🔒 Setup Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 🌐 Setup Nginx (Optional - Recommended)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/smartolt
```

Paste:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/smartolt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## 🔐 Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## 🔄 Update Aplikasi

### Dari VPS

```bash
cd /opt/smartolt

# Pull latest changes
git pull origin main

## Rebuild dan restart
docker-compose down
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker-compose exec app npx prisma db push
```

## 🔐 Default Credentials

**Admin:**
- Email: `admin@smartolt.com`
- Password: `Admin123!`

**Operator:**
- Email: `operator@smartolt.com`
- Password: `Operator123!`

**⚠️ PENTING:** Ganti password default setelah login pertama!

## 📊 Useful Commands

```bash
# Docker Commands
docker-compose ps              # Check status
docker-compose logs -f app     # View logs
docker-compose restart app     # Restart app
docker-compose down            # Stop all
docker-compose up -d           # Start all

# Database Commands
docker-compose exec app npx prisma studio     # Open DB GUI
docker-compose exec app npx prisma db push    # Push schema
docker-compose exec app npm run prisma:seed   # Seed data

# Backup Database
docker-compose exec postgres pg_dump -U smartolt smartolt_db > backup.sql

# Restore Database
docker-compose exec -T postgres psql -U smartolt smartolt_db < backup.sql
```

## 🐛 Troubleshooting

### Container tidak start

```bash
docker-compose logs
docker-compose down -v
docker-compose up -d --build
```

### Port conflict

```bash
# Check port usage
sudo lsof -i :3000
sudo lsof -i :5432

# Kill process or change port in docker-compose.yml
```

### Permission issues

```bash
sudo chown -R $USER:$USER /opt/smartolt
sudo chmod -R 755 /opt/smartolt
```

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [INSTALLATION_VPS.md](INSTALLATION_VPS.md) - Detailed VPS guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical summary

## 🔗 Links

- **GitHub Repository**: https://github.com/erlangh/MasterOLT
- **Issues**: https://github.com/erlangh/MasterOLT/issues
- **Documentation**: See README.md

---

**Selamat menggunakan SmartOLT Management System!** 🎉
# Run migrations if needed
#
## Alternatif: Tarik image dari GHCR tanpa build lokal
docker pull ghcr.io/erlangh/smartolt-app:latest
