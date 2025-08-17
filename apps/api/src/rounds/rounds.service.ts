import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoundsService {
  constructor(private readonly prisma: PrismaService) {}
  start(userId: string, level: number, contactId: string) {
    return this.prisma.round.create({ data: { userId, level, contactId } });
  }
  async reveal(userId: string, id: string) {
    return this.prisma.round.update({
      where: { id },
      data: { turns: { increment: 1 }, multiplicator: { decrement: 0.1 } },
    });
  }
  async guess(userId: string, id: string, correct: boolean) {
    const round = await this.prisma.round.findUnique({ where: { id } });
    if (!round) throw new Error('round_not_found');
    if (correct) {
      const delta = Math.max(10, Math.round(100 * Number(round.multiplicator)));
      const r = await this.prisma.round.update({
        where: { id },
        data: { status: 'won', finishedAt: new Date() },
      });
      await this.prisma.scoreEvent.create({
        data: { userId, roundId: id, type: 'win', delta },
      });
      return { round: r, delta };
    }
    const m = Math.max(0, Number(round.multiplicator) - 0.1);
    await this.prisma.round.update({
      where: { id },
      data: { multiplicator: m },
    });
    await this.prisma.scoreEvent.create({
      data: { userId, roundId: id, type: 'wrong_guess', delta: -10 },
    });
    return {
      round: await this.prisma.round.findUnique({ where: { id } }),
      delta: -10,
    };
  }
}
