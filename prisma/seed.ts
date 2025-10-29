import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smartolt.com' },
    update: {},
    create: {
      email: 'admin@smartolt.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('✓ Created admin user:', admin.email)

  // Create operator user
  const operatorPassword = await bcrypt.hash('Operator123!', 10)
  const operator = await prisma.user.upsert({
    where: { email: 'operator@smartolt.com' },
    update: {},
    create: {
      email: 'operator@smartolt.com',
      password: operatorPassword,
      name: 'Operator User',
      role: 'OPERATOR',
      status: 'ACTIVE',
    },
  })

  console.log('✓ Created operator user:', operator.email)

  // Create sample OLTs
  const olt1 = await prisma.oLT.upsert({
    where: { ipAddress: '192.168.1.100' },
    update: {},
    create: {
      name: 'OLT-Jakarta-01',
      ipAddress: '192.168.1.100',
      model: 'OLT-8000',
      vendor: 'Huawei',
      location: 'Jakarta Pusat',
      status: 'ONLINE',
      firmwareVersion: 'v2.1.5',
      totalPorts: 16,
      description: 'Main OLT for Jakarta Central area',
      latitude: -6.2088,
      longitude: 106.8456,
    },
  })

  console.log('✓ Created OLT:', olt1.name)

  const olt2 = await prisma.oLT.upsert({
    where: { ipAddress: '192.168.1.101' },
    update: {},
    create: {
      name: 'OLT-Bandung-01',
      ipAddress: '192.168.1.101',
      model: 'OLT-8000',
      vendor: 'ZTE',
      location: 'Bandung',
      status: 'ONLINE',
      firmwareVersion: 'v2.0.8',
      totalPorts: 16,
      description: 'Main OLT for Bandung area',
      latitude: -6.9175,
      longitude: 107.6191,
    },
  })

  console.log('✓ Created OLT:', olt2.name)

  // Create sample ODPs
  const odp1 = await prisma.oDP.upsert({
    where: { name: 'ODP - Jakarta Pusat' },
    update: {},
    create: {
      name: 'ODP - Jakarta Pusat',
      latitude: -6.2088,
      longitude: 106.8456,
      location: 'Jakarta Pusat',
      oltId: olt1.id,
      status: 'ONLINE',
    },
  })

  console.log('✓ Created ODP:', odp1.name)

  const odp2 = await prisma.oDP.upsert({
    where: { name: 'ODP - Sudirman' },
    update: {},
    create: {
      name: 'ODP - Sudirman',
      latitude: -6.223,
      longitude: 106.85,
      location: 'Sudirman, Jakarta',
      oltId: olt1.id,
      status: 'ONLINE',
    },
  })

  console.log('✓ Created ODP:', odp2.name)

  const odp3 = await prisma.oDP.upsert({
    where: { name: 'ODP - Bandung' },
    update: {},
    create: {
      name: 'ODP - Bandung',
      latitude: -6.9175,
      longitude: 107.6191,
      location: 'Bandung',
      oltId: olt2.id,
      status: 'ONLINE',
    },
  })

  console.log('✓ Created ODP:', odp3.name)

  // Create sample Cable Routes
  const routeJakarta = await prisma.cableRoute.upsert({
    where: { name: 'Route Jakarta Central' },
    update: {},
    create: {
      name: 'Route Jakarta Central',
      description: 'Fiber route from OLT Jakarta to ODPs Sudirman & Kuningan',
      color: '#16a34a',
      points: [
        { lat: -6.2088, lng: 106.8456, label: 'OLT Jakarta' },
        { lat: -6.223, lng: 106.85, label: 'ODP Sudirman' },
        { lat: -6.2305, lng: 106.86, label: 'ODP Kuningan' },
      ],
    },
  })

  console.log('✓ Created Cable Route:', routeJakarta.name)

  const routeBandung = await prisma.cableRoute.upsert({
    where: { name: 'Route Bandung City' },
    update: {},
    create: {
      name: 'Route Bandung City',
      description: 'Fiber route from OLT Bandung to ODP Braga',
      color: '#dc2626',
      points: [
        { lat: -6.9175, lng: 107.6191, label: 'OLT Bandung' },
        { lat: -6.905, lng: 107.61, label: 'ODP Braga' },
      ],
    },
  })

  console.log('✓ Created Cable Route:', routeBandung.name)

  // Create sample ONTs
  const ont1 = await prisma.oNT.upsert({
    where: { serialNumber: 'HWTC12345678' },
    update: {},
    create: {
      serialNumber: 'HWTC12345678',
      macAddress: '00:11:22:33:44:55',
      oltId: olt1.id,
      port: 1,
      status: 'ONLINE',
      signalStrength: -18.5,
      rxPower: -19.2,
      txPower: 2.5,
      distance: 1.2,
      customerName: 'PT. Example Indonesia',
      customerPhone: '+62-21-12345678',
      customerEmail: 'contact@example.co.id',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      servicePackage: '100 Mbps',
      installDate: new Date('2024-01-15'),
      notes: 'Corporate customer',
    },
  })

  console.log('✓ Created ONT:', ont1.serialNumber)

  const ont2 = await prisma.oNT.upsert({
    where: { serialNumber: 'HWTC87654321' },
    update: {},
    create: {
      serialNumber: 'HWTC87654321',
      macAddress: '00:11:22:33:44:56',
      oltId: olt1.id,
      port: 2,
      status: 'ONLINE',
      signalStrength: -20.1,
      rxPower: -20.8,
      txPower: 2.3,
      distance: 1.8,
      customerName: 'Budi Santoso',
      customerPhone: '+62-812-3456-7890',
      customerEmail: 'budi@email.com',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      servicePackage: '50 Mbps',
      installDate: new Date('2024-02-20'),
      notes: 'Residential customer',
    },
  })

  console.log('✓ Created ONT:', ont2.serialNumber)

  const ont3 = await prisma.oNT.upsert({
    where: { serialNumber: 'ZTEC11111111' },
    update: {},
    create: {
      serialNumber: 'ZTEC11111111',
      macAddress: '00:11:22:33:44:57',
      oltId: olt2.id,
      port: 1,
      status: 'ONLINE',
      signalStrength: -17.8,
      rxPower: -18.5,
      txPower: 2.6,
      distance: 0.9,
      customerName: 'Siti Nurhaliza',
      customerPhone: '+62-822-9876-5432',
      customerEmail: 'siti@email.com',
      address: 'Jl. Braga No. 78, Bandung',
      servicePackage: '200 Mbps',
      installDate: new Date('2024-03-10'),
      notes: 'Premium residential customer',
    },
  })

  console.log('✓ Created ONT:', ont3.serialNumber)

  // Create sample alarm
  await prisma.alarm.create({
    data: {
      deviceType: 'ONT',
      ontId: ont2.id,
      severity: 'WARNING',
      message: 'Signal strength degraded',
      description: 'ONT signal strength below threshold (-20 dBm)',
      status: 'ACTIVE',
    },
  })

  console.log('✓ Created sample alarm')

  // Create system configs
  await prisma.systemConfig.upsert({
    where: { key: 'company_name' },
    update: {},
    create: {
      key: 'company_name',
      value: 'SmartOLT Management',
      description: 'Company name displayed in the application',
    },
  })

  await prisma.systemConfig.upsert({
    where: { key: 'snmp_community' },
    update: {},
    create: {
      key: 'snmp_community',
      value: 'public',
      description: 'Default SNMP community string',
    },
  })

  console.log('✓ Created system configurations')

  console.log('\n✅ Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
