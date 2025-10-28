// Script untuk cek users di database
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      }
    })

    if (users.length === 0) {
      console.log('❌ No users found in database!')
      console.log('\nRun seeding first:')
      console.log('  npm run prisma:seed')
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`)
      users.forEach(user => {
        console.log(`📧 ${user.email}`)
        console.log(`   Name: ${user.name}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Status: ${user.status}`)
        console.log(`   Created: ${user.createdAt}`)
        console.log('')
      })
    }

    // Test password verification
    console.log('\n🔐 Testing password verification...\n')
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@smartolt.com' }
    })

    if (adminUser) {
      const testPassword = 'Admin123!'
      const isValid = await bcrypt.compare(testPassword, adminUser.password)
      console.log(`Admin password test (${testPassword}): ${isValid ? '✅ VALID' : '❌ INVALID'}`)
      
      if (!isValid) {
        console.log('\n⚠️  Password hash in database does not match!')
        console.log('Hash in DB:', adminUser.password.substring(0, 20) + '...')
      }
    }

    const operatorUser = await prisma.user.findUnique({
      where: { email: 'operator@smartolt.com' }
    })

    if (operatorUser) {
      const testPassword = 'Operator123!'
      const isValid = await bcrypt.compare(testPassword, operatorUser.password)
      console.log(`Operator password test (${testPassword}): ${isValid ? '✅ VALID' : '❌ INVALID'}`)
      
      if (!isValid) {
        console.log('\n⚠️  Password hash in database does not match!')
        console.log('Hash in DB:', operatorUser.password.substring(0, 20) + '...')
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
