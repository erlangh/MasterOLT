# Smart OLT - Panduan Deployment Lengkap

## Status Deployment Saat Ini

✅ **Aplikasi berjalan di**: `http://localhost:3001`  
✅ **Process Manager**: PM2 dengan `next start`  
✅ **Database**: SQLite di `prisma/dev.db`  
✅ **Authentication**: NextAuth dengan kredensial  
✅ **Static Assets**: Dilayani dengan benar  
✅ **Log Rotation**: Aktif dengan pm2-logrotate  
✅ **Backup System**: Script otomatis tersedia  

## Konfigurasi Environment

### File: `ecosystem.config.js`
```javascript
module.exports = {
  apps: [{
    name: 'smart-olt',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    env: {
      DATABASE_URL: 'file:C:/Users/FREEDOM/.trae/.github/MasterOLT/prisma/dev.db',
      NEXTAUTH_URL: 'http://localhost:3001',
      NEXTAUTH_SECRET: 'your-secret-key-here-change-in-production',
      PORT: '3001'
    }
  }]
}
```

### Kredensial Default
- **Admin**: `admin@smartolt.com` / `Admin123!`
- **Operator**: `operator@smartolt.com` / `Operator123!`

## Operasional PM2

### Perintah Dasar
```powershell
# Lihat status proses
pm2 list

# Lihat logs real-time
pm2 logs smart-olt

# Lihat logs dengan jumlah baris tertentu
pm2 logs smart-olt --lines 100

# Restart aplikasi
pm2 restart smart-olt

# Stop aplikasi
pm2 stop smart-olt

# Hapus aplikasi dari PM2
pm2 delete smart-olt

# Simpan konfigurasi PM2
pm2 save
```

### Monitoring
```powershell
# Monitor CPU dan Memory usage
pm2 monit

# Lihat informasi detail proses
pm2 describe smart-olt

# Lihat environment variables
pm2 env 0
```

## Backup Database

### Script Otomatis
Lokasi: `scripts/backup-database.ps1`

```powershell
# Backup manual
powershell -ExecutionPolicy Bypass -File scripts/backup-database.ps1

# Backup dengan parameter custom
powershell -ExecutionPolicy Bypass -File scripts/backup-database.ps1 -RetainDays 14
```

### Backup Terjadwal (Windows Task Scheduler)
```powershell
# Buat task scheduler untuk backup harian
schtasks /create /tn "SmartOLT-Backup" /tr "powershell.exe -ExecutionPolicy Bypass -File C:\Users\FREEDOM\.trae\.github\MasterOLT\scripts\backup-database.ps1" /sc daily /st 02:00
```

## Log Management

### Konfigurasi pm2-logrotate
- **Max Size**: 10MB per file
- **Retain**: 7 file backup
- **Compress**: Ya (gzip)
- **Format**: YYYY-MM-DD_HH-mm-ss

### Lokasi Log Files
```
C:\Users\FREEDOM\.pm2\logs\
├── smart-olt-out.log      # Output logs
├── smart-olt-error.log    # Error logs
└── pm2-logrotate-out.log  # Log rotation logs
```

## Troubleshooting

### 1. Aplikasi Tidak Bisa Diakses
```powershell
# Cek status PM2
pm2 list

# Cek logs untuk error
pm2 logs smart-olt --lines 50

# Restart jika perlu
pm2 restart smart-olt
```

### 2. Static Assets 404 Error
```powershell
# Pastikan menggunakan next start, bukan standalone
pm2 describe smart-olt

# Jika menggunakan standalone, ganti ke next start
pm2 delete smart-olt
pm2 start ecosystem.config.js
```

### 3. Database Connection Error
```powershell
# Cek file database ada
Test-Path "C:\Users\FREEDOM\.trae\.github\MasterOLT\prisma\dev.db"

# Cek permissions
icacls "C:\Users\FREEDOM\.trae\.github\MasterOLT\prisma\dev.db"

# Reset database jika perlu
npm run db:reset
```

### 4. Authentication Issues
```powershell
# Test login via API
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrf = Invoke-WebRequest -Uri http://localhost:3001/api/auth/csrf -WebSession $s
$token = ($csrf.Content | ConvertFrom-Json).csrfToken
Invoke-WebRequest -Method Post -Uri http://localhost:3001/api/auth/callback/credentials -WebSession $s -ContentType 'application/x-www-form-urlencoded' -Body "csrfToken=$token&email=admin@smartolt.com&password=Admin123!"
```

### 5. Port Conflicts
```powershell
# Cek port yang digunakan
netstat -ano | findstr :3001

# Kill proses jika perlu
taskkill /PID <PID> /F

# Ganti port di ecosystem.config.js jika perlu
```

## Performance Optimization

### 1. Memory Management
```powershell
# Set memory limit untuk PM2
pm2 start ecosystem.config.js --max-memory-restart 500M
```

### 2. Cluster Mode (Opsional)
```javascript
// ecosystem.config.js - untuk load tinggi
module.exports = {
  apps: [{
    name: 'smart-olt',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 2, // atau 'max' untuk semua CPU cores
    exec_mode: 'cluster',
    // ... env variables
  }]
}
```

## Security Checklist

### ✅ Sudah Dikonfigurasi
- [x] NEXTAUTH_SECRET diset (ganti di production)
- [x] Database file permissions
- [x] Log rotation aktif

### 🔄 Untuk Production
- [ ] Ganti NEXTAUTH_SECRET dengan nilai unik
- [ ] Setup HTTPS dengan reverse proxy
- [ ] Konfigurasi firewall
- [ ] Setup monitoring eksternal
- [ ] Backup database ke lokasi remote

## Deployment ke Production

### 1. Persiapan Server
```powershell
# Install Node.js dan PM2
npm install -g pm2

# Clone repository
git clone <repository-url>
cd MasterOLT

# Install dependencies
npm install

# Build aplikasi
npm run build
```

### 2. Konfigurasi Environment
```powershell
# Edit ecosystem.config.js
# Ganti DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, PORT
```

### 3. Setup Database
```powershell
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed data (opsional)
npm run db:seed
```

### 4. Start dengan PM2
```powershell
pm2 start ecosystem.config.js
pm2 save
pm2 startup windows  # Jalankan sebagai Administrator
```

## Monitoring dan Maintenance

### Daily Tasks
- Cek `pm2 list` untuk status aplikasi
- Review logs: `pm2 logs smart-olt --lines 50`
- Monitor disk space untuk logs dan backups

---

## Deployment dengan Docker Compose (Production)

### Prasyarat
- Docker dan Docker Compose terinstall
- Akses ke GitHub Container Registry (GHCR) untuk menarik image

### Langkah-langkah
1. Siapkan environment file
   ```bash
   cp .env.example .env
   # Edit .env sesuai kebutuhan production
   ```

2. Opsi A (Default saat ini): SQLite dengan volume persistensi
   
   Gunakan file `docker-compose.prod.yml` yang disertakan, lalu jalankan:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

   Ini akan:
   - Menjalankan container menggunakan image dari GHCR
   - Menggunakan SQLite (`prisma/dev.db`) dengan volume host `./data/dev.db`
   - Mengaktifkan healthcheck ke endpoint `/api/health`

   Inisialisasi database (pertama kali):
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npx prisma db push
   docker-compose -f docker-compose.prod.yml exec app npm run prisma:seed
   ```

3. Opsi B (Eksperimental): PostgreSQL
   
   Jika ingin menggunakan PostgreSQL, contoh konfigurasi ada di `docker-compose.yml`:
   ```yaml
   services:
     app:
       image: ghcr.io/erlangh/smartolt-app:latest
       container_name: smartolt-app
       restart: always
       ports:
         - "3000:3000"
       environment:
         DATABASE_URL: "postgresql://smartolt:smartolt123@postgres:5432/smartolt_db?schema=public"
         NEXTAUTH_URL: "http://localhost:3000"
         NEXTAUTH_SECRET: "your-secret-key-change-this-in-production-min-32-chars"
         NODE_ENV: "production"
       depends_on:
         postgres:
           condition: service_started
       networks:
         - smartolt-network
   ```

   Catatan penting:
   - Saat ini `schema.prisma` menggunakan `provider = "sqlite"`
   - Untuk benar-benar menggunakan PostgreSQL, perlu migrasi skema dan mengganti provider Prisma ke `postgresql`
   - Jika belum migrasi, aplikasi akan tetap menggunakan SQLite (fallback) sesuai logika di `lib/prisma.ts`

4. Jalankan aplikasi
   ```bash
   docker-compose up -d
   ```

5. Inisialisasi database
   ```bash
   # Push schema ke database
   docker-compose exec app npx prisma db push

   # Seed data default
   docker-compose exec app npm run prisma:seed
   ```

6. Menggunakan image versi tertentu (stabil)
   ```yaml
   services:
     app:
       image: ghcr.io/erlangh/smartolt-app:v1.0.0
       # konfigurasi lainnya sama seperti di atas
   ```

### Troubleshooting (Docker)
- Cek logs container: `docker-compose logs -f app`
- Cek kesehatan service: `docker ps` dan `docker inspect <container>`
- Pastikan network Compose aktif: `docker network ls`


### Weekly Tasks
- Backup database manual
- Review dan cleanup old logs
- Update dependencies jika ada security patches

### Monthly Tasks
- Review performance metrics
- Update aplikasi ke versi terbaru
- Audit security settings

## Kontak Support

Untuk masalah deployment atau konfigurasi, dokumentasikan:
1. Output dari `pm2 list`
2. Logs dari `pm2 logs smart-olt --lines 100`
3. Environment variables dari `pm2 env 0`
4. Langkah yang sudah dicoba

---
*Dokumentasi ini dibuat pada: 2025-11-02*  
*Versi PM2: Latest*  
*Versi Node.js: 22.20.0*