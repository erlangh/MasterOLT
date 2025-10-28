# SmartOLT Management System

Aplikasi web management untuk OLT (Optical Line Terminal) yang komprehensif dengan fitur monitoring, konfigurasi, dan manajemen perangkat jaringan fiber optik.

![SmartOLT](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-brightgreen)

## 🚀 Fitur Utama

### 1. **Authentication & Authorization**
- Login/Logout system dengan NextAuth.js
- Role-based access control (Admin, Operator, Viewer)
- Session management dengan JWT
- Remember me functionality

### 2. **Dashboard**
- Overview statistics real-time
- Network health metrics
- Performance charts (bandwidth, signal strength)
- Recent activities log

### 3. **OLT Management**
- CRUD operations untuk OLT devices
- Monitoring status online/offline
- Port configuration
- Firmware tracking

### 4. **ONT/ONU Management**
- List dan management ONT devices
- Signal strength monitoring
- Customer information linking
- Status tracking real-time

### 5. **Network Monitoring**
- Real-time device status
- Signal quality monitoring
- Alarm & notifications system

### 6. **User Management**
- CRUD operations untuk users
- Role assignment
- Activity tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

Sebelum instalasi, pastikan sistem Anda sudah memiliki:

- Node.js 20+ 
- Docker & Docker Compose (untuk production)
- PostgreSQL 16+ (jika tidak menggunakan Docker)
- npm atau yarn

## 🔧 Instalasi

### Development Mode (Tanpa Docker)

1. **Clone repository**
```bash
cd smartolt-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database PostgreSQL**
```bash
# Jalankan PostgreSQL di sistem Anda atau gunakan Docker:
docker run --name smartolt-postgres -e POSTGRES_USER=smartolt -e POSTGRES_PASSWORD=smartolt123 -e POSTGRES_DB=smartolt_db -p 5432:5432 -d postgres:16-alpine
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env dengan konfigurasi database Anda
```

5. **Generate Prisma Client dan Push schema**
```bash
npx prisma generate
npx prisma db push
```

6. **Seed database dengan data sample**
```bash
npm install -g tsx
npm run prisma:seed
```

7. **Run development server**
```bash
npm run dev
```

8. **Akses aplikasi**
```
http://localhost:3000
```

### Production Mode (Dengan Docker)

1. **Clone repository**
```bash
cd smartolt-app
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan production
```

3. **Build dan jalankan dengan Docker Compose**
```bash
docker-compose up -d --build
```

4. **Setup database (first time only)**
```bash
# Push schema
docker-compose exec app npx prisma db push

# Seed database
docker-compose exec app npm run prisma:seed
```

5. **Akses aplikasi**
```
http://localhost:3000
```

## 🔐 Default Credentials

Setelah seeding database, gunakan credentials berikut:

**Admin Account:**
- Email: `admin@smartolt.com`
- Password: `Admin123!`

**Operator Account:**
- Email: `operator@smartolt.com`
- Password: `Operator123!`

## 📁 Struktur Direktori

```
smartolt-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── dashboard/            # Dashboard pages
│   ├── login/                # Auth pages
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── layout/               # Layout components
│   ├── dashboard/            # Dashboard components
│   ├── olts/                 # OLT components
│   └── onts/                 # ONT components
├── lib/                      # Utility libraries
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Prisma client
│   └── utils.ts              # Helper functions
├── prisma/                   # Database schema & seeds
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── types/                    # TypeScript type definitions
├── docker-compose.yml        # Docker compose config
├── Dockerfile                # Docker config
└── .env                      # Environment variables
```

## 🌐 Deployment ke VPS Ubuntu 22

### 1. Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user ke docker group
sudo usermod -aG docker $USER
```

### 2. Upload Aplikasi

```bash
# Upload via git
git clone <your-repo-url>
cd smartolt-app

# Atau upload via SCP/SFTP
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env

# Update configuration:
# - DATABASE_URL
# - NEXTAUTH_URL (gunakan domain/IP server)
# - NEXTAUTH_SECRET (generate secret baru)
```

### 4. Deploy dengan Docker

```bash
# Build dan start
docker-compose up -d --build

# Setup database
docker-compose exec app npx prisma db push
docker-compose exec app npm run prisma:seed

# Check logs
docker-compose logs -f app
```

### 5. Setup Nginx (Optional - untuk SSL/domain)

```bash
# Install Nginx
sudo apt install nginx -y

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/smartolt

# Paste konfigurasi:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smartolt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL dengan Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 6. Setup Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🔄 Update Aplikasi

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose up -d --build

# Run migrations jika ada
docker-compose exec app npx prisma db push
```

## 🛑 Stop Aplikasi

```bash
# Stop containers
docker-compose down

# Stop dan hapus volumes (HATI-HATI: akan menghapus data!)
docker-compose down -v
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL status
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### App Not Starting

```bash
# Check logs
docker-compose logs app

# Rebuild from scratch
docker-compose down
docker-compose up -d --build --force-recreate
```

### Prisma Issues

```bash
# Regenerate Prisma client
docker-compose exec app npx prisma generate

# Reset database (HATI-HATI)
docker-compose exec app npx prisma db push --force-reset
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key (min 32 chars) | Required |
| `NODE_ENV` | Environment mode | `development` |

## 🔒 Security Best Practices

1. **Ganti NEXTAUTH_SECRET** di production
2. **Gunakan strong password** untuk database
3. **Enable firewall** di VPS
4. **Setup SSL/HTTPS** dengan Let's Encrypt
5. **Regular backup** database
6. **Update dependencies** secara berkala
7. **Monitor logs** untuk aktivitas mencurigakan

## 📊 Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U smartolt smartolt_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U smartolt smartolt_db < backup.sql
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.
