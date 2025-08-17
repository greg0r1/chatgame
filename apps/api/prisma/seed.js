const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  await db.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      email: 'dev@example.com',
      username: 'dev',
      passwordHash: 'x',
      locale: 'fr',
      Profile: {
        create: { displayName: 'Développeur', avatarUrl: null, country: 'FR' },
      },
      Inventory: { create: { hintTokens: 0 } },
    },
  });
  console.log('DEV_USER_ID=' + DEV_USER_ID);
}
main().finally(() => db.$disconnect());
