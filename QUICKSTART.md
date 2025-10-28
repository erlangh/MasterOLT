# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan SmartOLT Management System di komputer lokal Anda.

## Prasyarat

- Node.js 20 atau lebih baru
- npm atau yarn
- PostgreSQL 16 (atau gunakan Docker)

## Instalasi Cepat (5 Menit)

### 1. Clone dan Masuk ke Direktori

```bash
cd smartolt-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database dengan Docker (Termudah)

```bash
# Jalankan PostgreSQL di Docker
docker run --name smartolt-postgres \
  -e POSTGRES_USER=smartolt \
  -e POSTGRES_PASSWORD=smartolt123 \
  -e POSTGRES_DB=smartolt_db \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 4. Setup Environment

```bash
# Copy file .env.example
cp .env.example .env

# File .env sudah siap digunakan untuk development
```

### 5. Setup Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push
```

### 6. Seed Database

```bash
# Install tsx (jika belum)
npm install -g tsx

# Seed database dengan data sample
npm run prisma:seed
```

### 7. Jalankan Development Server

```bash
npm run dev
```

### 8. Akses Aplikasi

Buka browser dan akses:
```
http://localhost:3000
```

### 9. Login

Gunakan credentials default:

**Admin:**
- Email: `admin@smartolt.com`
- Password: `Admin123!`

**Operator:**
- Email: `operator@smartolt.com`
- Password: `Operator123!`

## 🎉 Selesai!

Aplikasi sekarang berjalan di komputer Anda dengan:
- ✅ 2 user accounts (admin & operator)
- ✅ 2 sample OLTs (Jakarta & Bandung)
- ✅ 3 sample ONTs dengan data pelanggan
- ✅ 1 sample alarm

## 📚 Next Steps

1. Explore Dashboard - Lihat overview statistics
2. Manage OLTs - Kelola optical line terminals
3. Manage ONTs - Kelola optical network terminals
4. View Monitoring - Check real-time status
5. Check Alarms - Lihat active alarms

## 🔧 Perintah Berguna

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run start            # Start production server

# Database
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema changes
npm run prisma:seed      # Seed database

# Docker (Production)
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?

```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Database connection error?

```bash
# Check PostgreSQL status
docker ps

# Restart PostgreSQL
docker restart smartolt-postgres

# Check .env file - pastikan DATABASE_URL benar
```

### Dependencies error?

```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📖 Full Documentation

Untuk dokumentasi lengkap, lihat:
- [README.md](README.md) - Dokumentasi lengkap
- [INSTALLATION_VPS.md](INSTALLATION_VPS.md) - Panduan deployment ke VPS

## 💡 Tips

1. **Gunakan Docker untuk database** - Lebih mudah daripada install PostgreSQL langsung
2. **Gunakan Prisma Studio** - GUI bagus untuk explore database: `npx prisma studio`
3. **Check logs** - Jika ada error, cek terminal untuk error messages
4. **Hot reload** - Development server akan auto-reload saat Anda edit file

---

Selamat mencoba! 🎉
