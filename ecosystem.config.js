module.exports = {
  apps: [
    {
      name: 'smart-olt',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '.',
      env: {
        DATABASE_URL: 'file:C:/Users/FREEDOM/.trae/.github/MasterOLT/prisma/dev.db',
        NEXTAUTH_URL: 'http://localhost:3001',
        NEXTAUTH_SECRET: 'your-secret-key-here-change-in-production',
        PORT: '3001'
      }
    }
  ]
};