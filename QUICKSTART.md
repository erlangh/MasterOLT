# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan SmartOLT Management System di komputer lokal Anda.

## Prasyarat

- Node.js 20 atau lebih baru
- npm atau yarn
- Docker (opsional, untuk menjalankan via Compose)

## Instalasi Cepat (5 Menit)

### 1. Clone dan Masuk ke Direktori

```bash
cd smartolt-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Default: SQLite (Tanpa Postgres)

Tidak perlu menyiapkan PostgreSQL untuk development. Secara default aplikasi menggunakan SQLite dengan file lokal `prisma/dev.db`.

### 4. Setup Environment

```bash
# Copy file .env.example
cp .env.example .env

# File .env sudah siap digunakan untuk development
```

### 5. Setup Database Schema (SQLite)

```bash
# Generate Prisma client
npx prisma generate

# Sinkronkan schema ke SQLite
npx prisma db push
```

### 6. Seed Database

```bash
# Install tsx (jika belum)
npm install -g tsx

# Seed database dengan data sample
npm run prisma:seed
```

### 7. Jalankan Development Server (Tanpa Docker)

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

# Docker (Production - SQLite default)
docker-compose -f docker-compose.prod.yml up -d   # Start prod services
docker-compose -f docker-compose.prod.yml down    # Stop prod services
docker-compose -f docker-compose.prod.yml logs -f # View logs
```

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?

```bash
# Gunakan port lain
npm run dev -- -p 3001
```

### Database connection error?

```bash
# Pastikan `DATABASE_URL` mengarah ke file SQLite yang valid
# Default development: DATABASE_URL="file:./prisma/dev.db"
# Gunakan Prisma Studio untuk verifikasi
npx prisma studio
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
