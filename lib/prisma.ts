import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure Prisma always receives a valid SQLite file URL.
// If `DATABASE_URL` is missing or not starting with `file:`,
// fall back to an absolute path within the project (`prisma/dev.db`).
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL
  if (envUrl && envUrl.startsWith('file:')) {
    return envUrl
  }
  const absPath = path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')
  return `file:${absPath}`
}

const prismaClient = new PrismaClient({
  datasources: {
    db: { url: resolveDatabaseUrl() },
  },
})

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
