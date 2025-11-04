# Smart OLT Database Backup Script
# Membuat backup database SQLite dengan timestamp

param(
    [string]$DatabasePath = "C:\Users\FREEDOM\.trae\.github\MasterOLT\prisma\dev.db",
    [string]$BackupDir = "C:\Users\FREEDOM\.trae\.github\MasterOLT\backups",
    [int]$RetainDays = 7
)

# Buat direktori backup jika belum ada
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Host "Created backup directory: $BackupDir" -ForegroundColor Green
}

# Generate timestamp untuk nama file backup
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFileName = "smartolt_backup_$timestamp.db"
$backupPath = Join-Path $BackupDir $backupFileName

try {
    # Copy database file
    if (Test-Path $DatabasePath) {
        Copy-Item $DatabasePath $backupPath -Force
        Write-Host "Database backup created: $backupPath" -ForegroundColor Green
        
        # Verifikasi ukuran file
        $originalSize = (Get-Item $DatabasePath).Length
        $backupSize = (Get-Item $backupPath).Length
        
        if ($originalSize -eq $backupSize) {
            Write-Host "Backup verification successful (Size: $backupSize bytes)" -ForegroundColor Green
        } else {
            Write-Warning "Backup size mismatch! Original: $originalSize, Backup: $backupSize"
        }
    } else {
        Write-Error "Database file not found: $DatabasePath"
        exit 1
    }
    
    # Cleanup old backups
    $cutoffDate = (Get-Date).AddDays(-$RetainDays)
    $oldBackups = Get-ChildItem $BackupDir -Filter "smartolt_backup_*.db" | Where-Object { $_.CreationTime -lt $cutoffDate }
    
    if ($oldBackups.Count -gt 0) {
        Write-Host "Cleaning up $($oldBackups.Count) old backup(s)..." -ForegroundColor Yellow
        $oldBackups | Remove-Item -Force
        Write-Host "Old backups removed" -ForegroundColor Green
    }
    
    # Summary
    $totalBackups = (Get-ChildItem $BackupDir -Filter "smartolt_backup_*.db").Count
    Write-Host "Backup completed successfully. Total backups: $totalBackups" -ForegroundColor Cyan
    
} catch {
    Write-Error "Backup failed: $($_.Exception.Message)"
    exit 1
}