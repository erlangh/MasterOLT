// Script untuk reset password admin
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...\n')
    
    // Hash password baru
    const newPassword = 'Admin123!'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update admin user
    const admin = await prisma.user.update({
      where: { email: 'admin@smartolt.com' },
      data: { 
        password: hashedPassword,
        status: 'ACTIVE'
      },
    })
    
    console.log('✅ Admin password reset successfully!')
    console.log('\nLogin credentials:')
    console.log('  Email: admin@smartolt.com')
    console.log('  Password: Admin123!')
    console.log('\n⚠️  Please change this password after login!\n')
    
    // Test password verification
    const isValid = await bcrypt.compare(newPassword, hashedPassword)
    console.log(`Password verification test: ${isValid ? '✅ PASS' : '❌ FAIL'}\n`)
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.error('❌ Admin user not found!')
      console.log('\nPlease run seeding first:')
      console.log('  npm run prisma:seed\n')
    } else {
      console.error('❌ Error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
