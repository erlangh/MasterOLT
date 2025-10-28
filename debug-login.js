// Script untuk debug masalah login
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function debugLogin() {
  try {
    console.log('🔍 Debugging login issue...\n')
    
    // 1. Cek admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@smartolt.com' }
    })
    
    if (!admin) {
      console.log('❌ Admin user NOT found in database!')
      console.log('\nCreating admin user...\n')
      
      const hashedPassword = await bcrypt.hash('Admin123!', 10)
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@smartolt.com',
          password: hashedPassword,
          name: 'Administrator',
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      })
      
      console.log('✅ Admin user created successfully!')
      console.log('Email:', newAdmin.email)
      console.log('Status:', newAdmin.status)
      console.log('Role:', newAdmin.role)
      console.log('\nNow test login with:')
      console.log('  Email: admin@smartolt.com')
      console.log('  Password: Admin123!\n')
      return
    }
    
    console.log('✅ Admin user found!')
    console.log('Email:', admin.email)
    console.log('Name:', admin.name)
    console.log('Role:', admin.role)
    console.log('Status:', admin.status)
    console.log('Created:', admin.createdAt)
    console.log('Last Login:', admin.lastLogin || 'Never')
    console.log('Password hash (first 30 chars):', admin.password.substring(0, 30) + '...')
    console.log('')
    
    // 2. Test berbagai password
    const passwords = [
      'Admin123!',
      'admin123!',
      'Admin123',
      'Operator123!'
    ]
    
    console.log('🔐 Testing passwords:\n')
    
    for (const pwd of passwords) {
      const isValid = await bcrypt.compare(pwd, admin.password)
      console.log(`  "${pwd}": ${isValid ? '✅ VALID' : '❌ INVALID'}`)
    }
    
    console.log('')
    
    // 3. Generate dan test fresh hash
    console.log('🔄 Generating fresh hash for "Admin123!"...\n')
    const freshHash = await bcrypt.hash('Admin123!', 10)
    const freshTest = await bcrypt.compare('Admin123!', freshHash)
    console.log('Fresh hash test:', freshTest ? '✅ PASS' : '❌ FAIL')
    console.log('Fresh hash (first 30 chars):', freshHash.substring(0, 30) + '...')
    console.log('DB hash (first 30 chars):', admin.password.substring(0, 30) + '...')
    console.log('')
    
    // 4. Update dengan hash baru jika test gagal semua
    const anyValid = await Promise.all(
      passwords.map(pwd => bcrypt.compare(pwd, admin.password))
    ).then(results => results.some(r => r))
    
    if (!anyValid) {
      console.log('⚠️  No password matched! Updating with fresh hash...\n')
      
      await prisma.user.update({
        where: { email: 'admin@smartolt.com' },
        data: { 
          password: freshHash,
          status: 'ACTIVE'
        },
      })
      
      // Verify update
      const updated = await prisma.user.findUnique({
        where: { email: 'admin@smartolt.com' }
      })
      
      const verifyUpdate = await bcrypt.compare('Admin123!', updated.password)
      
      console.log('✅ Password updated!')
      console.log('Verification:', verifyUpdate ? '✅ PASS' : '❌ FAIL')
      console.log('\nTry login now with:')
      console.log('  Email: admin@smartolt.com')
      console.log('  Password: Admin123!')
    } else {
      console.log('✅ At least one password matched!')
      console.log('\nIf still can\'t login, check:')
      console.log('1. Clear browser cache/cookies')
      console.log('2. Try incognito/private window')
      console.log('3. Check NextAuth configuration')
      console.log('4. Check application logs: docker-compose logs app | tail -50')
    }
    
    console.log('')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

debugLogin()
