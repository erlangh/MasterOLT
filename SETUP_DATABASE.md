# Database Setup Guide

## Error: Table does not exist

Jika kamu mendapat error:
```
Invalid `prisma.user.findUnique()` invocation: The table `public.User` does not exist in the current database.
```

Ini berarti database belum di-setup. Ikuti langkah berikut:

## Setup Database (First Time)

### Option 1: Dari dalam Docker Container

```bash
# Masuk ke container app
docker-compose exec app sh

# Generate Prisma Client (jika belum)
npx prisma generate

# Buat semua tabel di database
npx prisma db push

# Isi data awal (users, sample data)
npm run prisma:seed

# Keluar dari container
exit
```

### Option 2: Satu baris command

```bash
# Generate, push schema, dan seed
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma db push
docker-compose exec app npm run prisma:seed
```

### Verifikasi Database

```bash
# Cek apakah tabel sudah dibuat
docker-compose exec postgres psql -U smartolt -d smartolt_db -c "\dt"

# Output yang diharapkan:
#           List of relations
#  Schema |        Name        | Type  |  Owner   
# --------+--------------------+-------+----------
#  public | ActivityLog        | table | smartolt
#  public | Alarm              | table | smartolt
#  public | ONT                | table | smartolt
#  public | OLT                | table | smartolt
#  public | Report             | table | smartolt
#  public | SystemConfig       | table | smartolt
#  public | User               | table | smartolt
```

## After Setup

Setelah setup berhasil, coba akses aplikasi:

1. **Health Check**: http://your-vps-ip:3000/api/health
2. **Login Page**: http://your-vps-ip:3000/login

### Default Login Credentials

- **Admin**: 
  - Email: `admin@smartolt.com`
  - Password: `Admin123!`

- **Operator**: 
  - Email: `operator@smartolt.com`
  - Password: `Operator123!`

**⚠️ PENTING: Ganti password default setelah login pertama kali!**

## Troubleshooting

### Error: Connection refused

```bash
# Cek status containers
docker-compose ps

# Pastikan postgres dan app running
# Status harus "Up"
```

### Error: Database does not exist

```bash
# Buat database manual
docker-compose exec postgres psql -U smartolt -c "CREATE DATABASE smartolt_db;"
```

### Reset Database (Hati-hati! Menghapus semua data)

```bash
# Stop containers
docker-compose down -v

# Start fresh
docker-compose up -d

# Setup database lagi
docker-compose exec app npx prisma db push
docker-compose exec app npm run prisma:seed
```

### Prisma Studio (GUI untuk Database)

Jika ingin lihat isi database dengan GUI:

```bash
# Di local development
npx prisma studio

# Atau port forward dari VPS
ssh -L 5555:localhost:5555 user@vps-ip
# Lalu di VPS:
docker-compose exec app npx prisma studio
# Akses di browser: http://localhost:5555
```

## Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U smartolt smartolt_db > backup_$(date +%Y%m%d).sql

# Restore database
docker-compose exec -T postgres psql -U smartolt smartolt_db < backup_20250101.sql
```

## Check Logs

Jika masih error setelah setup:

```bash
# Logs aplikasi
docker-compose logs -f app

# Logs database
docker-compose logs -f postgres

# Logs semua services
docker-compose logs -f
```

## Windows + SQLite (Local Development)

Jika menggunakan Prisma dengan provider `sqlite` dan menjalankan Next.js build `output: standalone`:

- Gunakan `DATABASE_URL` dengan path absolut berawalan `file:` agar Prisma selalu menemukan file DB:

```
DATABASE_URL="file:C:/Users/FREEDOM/.trae/.github/MasterOLT/prisma/dev.db"
```

- Jalankan server standalone dengan environment variable yang disetel eksplisit:

```
$env:DATABASE_URL='file:C:/Users/FREEDOM/.trae/.github/MasterOLT/prisma/dev.db'
$env:PORT=3005
node .next/standalone/server.js
```

- Sinkronkan schema Prisma ke SQLite jika tabel belum ada:

```
npx prisma db push
```

- Seed data contoh (opsional, membutuhkan `ts-node`):

```
npx ts-node prisma/seed.ts
```
