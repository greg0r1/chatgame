import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  await db.contact.upsert({
    where: { id: 'curie' },
    update: {},
    create: {
      id: 'curie',
      usageName: 'Marie Curie',
      photoUrl: null,
      description: 'Physicienne et chimiste, double Prix Nobel.',
    },
  });
  await db.contact.upsert({
    where: { id: 'davinci' },
    update: {},
    create: {
      id: 'davinci',
      usageName: 'Léonard de Vinci',
      photoUrl: null,
      description: 'Artiste et inventeur de la Renaissance.',
    },
  });
  await db.contact.upsert({
    where: { id: 'christie' },
    update: {},
    create: {
      id: 'christie',
      usageName: 'Agatha Christie',
      photoUrl: null,
      description: 'Romancière, reine du crime.',
    },
  });

  const msgs = [
    {
      id: 'c1-1',
      contactId: 'curie',
      level: 1,
      seq: 1,
      type: 'opening',
      signal: 'faible',
      textFr: 'Tu es encore au labo si tôt ? On dirait moi avec mon tablier.',
    },
    {
      id: 'c1-2',
      contactId: 'curie',
      level: 1,
      seq: 2,
      type: 'implicitHint',
      signal: 'faible',
      textFr: 'Quand Paris se tait, je pense à Varsovie.',
    },
    {
      id: 'c1-3',
      contactId: 'curie',
      level: 1,
      seq: 3,
      type: 'implicitHint',
      signal: 'moyen',
      textFr: 'Deux éléments me hantent.',
    },
    {
      id: 'c1-4',
      contactId: 'curie',
      level: 1,
      seq: 4,
      type: 'explicitHint',
      signal: 'fort',
      textFr: 'Deux distinctions dans deux sciences.',
    },
    {
      id: 'c1-5',
      contactId: 'curie',
      level: 1,
      seq: 5,
      type: 'explicitHint',
      signal: 'fort',
      textFr: 'Boulevard Edgar-Quinet, la lumière dure tard.',
    },
  ];
  for (const m of msgs)
    await db.message.upsert({ where: { id: m.id }, update: {}, create: m });
}

main().finally(() => db.$disconnect());
