# Panduan Instalasi SmartOLT di VPS Ubuntu 22.04

Panduan lengkap untuk deployment aplikasi SmartOLT Management System ke VPS Ubuntu 22.04.

## 📋 Prasyarat

- VPS dengan Ubuntu 22.04 LTS
- Minimal 2GB RAM
- Minimal 20GB disk space
- Root atau sudo access
- Domain (opsional, untuk SSL)

## 🔧 Langkah 1: Persiapan Server

### 1.1 Login ke VPS

```bash
ssh root@your-vps-ip
# atau
ssh your-username@your-vps-ip
```

### 1.2 Update Sistem

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verifikasi instalasi
docker --version
```

### 1.4 Install Docker Compose

```bash
# Install Docker Compose
sudo apt install docker-compose -y

# Verifikasi instalasi
docker-compose --version
```

### 1.5 Setup Docker untuk Non-Root User (Opsional)

```bash
# Tambahkan user ke docker group
sudo usermod -aG docker $USER

# Logout dan login ulang untuk apply changes
exit
```

## 📦 Langkah 2: Upload Aplikasi ke VPS

### Opsi A: Via Git (Recommended)

```bash
# Install git jika belum ada
sudo apt install git -y

# Clone repository
cd /opt
sudo git clone <your-repository-url> smartolt
cd smartolt/smartolt-app

# Set permissions
sudo chown -R $USER:$USER /opt/smartolt
```

### Opsi B: Via SCP/SFTP

```bash
# Dari komputer lokal
cd smartolt-app
tar -czf smartolt-app.tar.gz .
scp smartolt-app.tar.gz user@your-vps-ip:/tmp/

# Di VPS
sudo mkdir -p /opt/smartolt
cd /opt/smartolt
sudo tar -xzf /tmp/smartolt-app.tar.gz
sudo chown -R $USER:$USER /opt/smartolt
```

## ⚙️ Langkah 3: Konfigurasi Environment

### 3.1 Setup Environment Variables

```bash
cd /opt/smartolt/smartolt-app
cp .env.example .env
nano .env
```

### 3.2 Edit File .env

```env
# Database Configuration
DATABASE_URL="postgresql://smartolt:SmartOLT_SecurePass123!@postgres:5432/smartolt_db?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://your-domain.com"  # atau http://your-vps-ip:3000
NEXTAUTH_SECRET="ganti-dengan-random-string-minimal-32-karakter-untuk-production"

# Application
NODE_ENV="production"
```

**PENTING:**
- Ganti `SmartOLT_SecurePass123!` dengan password database yang kuat
- Ganti `NEXTAUTH_SECRET` dengan random string minimal 32 karakter
- Untuk generate NEXTAUTH_SECRET: `openssl rand -base64 32`

### 3.3 Update docker-compose.yml

```bash
nano docker-compose.yml
```

Update password database sesuai dengan .env:

```yaml
environment:
  POSTGRES_PASSWORD: SmartOLT_SecurePass123!  # Sama dengan di .env
```

## 🚀 Langkah 4: Deploy Aplikasi

### 4.1 Build dan Start Container

```bash
cd /opt/smartolt/smartolt-app

# Build dan start semua services
sudo docker-compose up -d --build
```

### 4.2 Tunggu Container Siap

```bash
# Check status containers
sudo docker-compose ps

# Check logs
sudo docker-compose logs -f app
# Tekan Ctrl+C untuk keluar dari logs
```

### 4.3 Setup Database

```bash
# Push database schema
sudo docker-compose exec app npx prisma db push

# Seed database dengan data awal
sudo docker-compose exec app npm run prisma:seed
```

### 4.4 Verifikasi Aplikasi

```bash
# Check logs untuk errors
sudo docker-compose logs app

# Test aplikasi
curl http://localhost:3000
```

Aplikasi sekarang berjalan di `http://your-vps-ip:3000`

## 🔒 Langkah 5: Setup Firewall

```bash
# Install UFW jika belum ada
sudo apt install ufw -y

# Allow SSH (PENTING! Jangan sampai terkunci dari server)
sudo ufw allow 22/tcp

# Allow HTTP dan HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🌐 Langkah 6: Setup Nginx Reverse Proxy (Recommended)

### 6.1 Install Nginx

```bash
sudo apt install nginx -y
```

### 6.2 Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/smartolt
```

Paste konfigurasi berikut:

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

### 6.3 Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smartolt /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx auto-start
sudo systemctl enable nginx
```

## 🔐 Langkah 7: Setup SSL dengan Let's Encrypt (Recommended)

### 7.1 Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Generate SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts:
- Enter email address
- Agree to terms
- Choose redirect HTTP to HTTPS (option 2)

### 7.3 Auto-Renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up cron job for renewal
```

## 🔄 Langkah 8: Setup Auto-Start (Systemd)

### 8.1 Create Systemd Service

```bash
sudo nano /etc/systemd/system/smartolt.service
```

Paste konfigurasi:

```ini
[Unit]
Description=SmartOLT Management Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/smartolt/smartolt-app
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

### 8.2 Enable Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable smartolt

# Start service
sudo systemctl start smartolt

# Check status
sudo systemctl status smartolt
```

## 📊 Langkah 9: Monitoring & Maintenance

### 9.1 Perintah Berguna

```bash
# Check container status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f app
sudo docker-compose logs -f postgres

# Restart services
sudo docker-compose restart app

# Stop services
sudo docker-compose down

# Start services
sudo docker-compose up -d
```

### 9.2 Backup Database

```bash
# Create backup directory
mkdir -p /opt/smartolt/backups

# Backup database
sudo docker-compose exec postgres pg_dump -U smartolt smartolt_db > /opt/smartolt/backups/backup-$(date +%Y%m%d-%H%M%S).sql

# Automated backup (add to crontab)
crontab -e

# Add line untuk backup setiap hari jam 2 pagi:
0 2 * * * cd /opt/smartolt/smartolt-app && docker-compose exec -T postgres pg_dump -U smartolt smartolt_db > /opt/smartolt/backups/backup-$(date +\%Y\%m\%d-\%H\%M\%S).sql
```

### 9.3 Restore Database

```bash
# Restore from backup
sudo docker-compose exec -T postgres psql -U smartolt smartolt_db < /opt/smartolt/backups/backup-YYYYMMDD-HHMMSS.sql
```

## 🔄 Langkah 10: Update Aplikasi

### Via Git

```bash
cd /opt/smartolt/smartolt-app

# Pull latest changes
git pull origin main

# Rebuild and restart
sudo docker-compose down
sudo docker-compose up -d --build

# Run migrations if needed
sudo docker-compose exec app npx prisma db push
```

### Manual Update

```bash
# Upload new files via SCP
# Then restart
cd /opt/smartolt/smartolt-app
sudo docker-compose down
sudo docker-compose up -d --build
```

## 🐛 Troubleshooting

### Container tidak start

```bash
# Check logs
sudo docker-compose logs

# Rebuild from scratch
sudo docker-compose down -v
sudo docker-compose up -d --build
```

### Database connection error

```bash
# Check PostgreSQL logs
sudo docker-compose logs postgres

# Restart PostgreSQL
sudo docker-compose restart postgres

# Check network
sudo docker network ls
sudo docker network inspect smartolt-network
```

### Permission issues

```bash
# Fix ownership
sudo chown -R $USER:$USER /opt/smartolt

# Fix permissions
sudo chmod -R 755 /opt/smartolt
```

### Port already in use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process or change port in docker-compose.yml
```

## 🔐 Security Checklist

- [x] Strong database password
- [x] Unique NEXTAUTH_SECRET
- [x] Firewall enabled (UFW)
- [x] SSL certificate installed
- [x] Regular backups configured
- [x] Non-root user for Docker
- [x] Nginx rate limiting (optional)
- [x] Fail2ban installed (optional)

## 📝 Default Credentials

Setelah instalasi, login dengan:

**Admin:**
- Email: `admin@smartolt.com`
- Password: `Admin123!`

**PENTING:** Segera ganti password default setelah login pertama!

## 📞 Support

Jika mengalami masalah:
1. Check logs: `sudo docker-compose logs -f`
2. Check documentation di README.md
3. Create issue di repository

## 🎉 Selesai!

Aplikasi SmartOLT sekarang sudah berjalan di VPS Anda!

Access aplikasi:
- Without Nginx: `http://your-vps-ip:3000`
- With Nginx: `http://your-domain.com`
- With SSL: `https://your-domain.com`
