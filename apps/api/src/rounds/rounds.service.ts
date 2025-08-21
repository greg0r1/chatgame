import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StartRoundDto } from './dto/start-round.dto';
import { GuessDto } from './dto/guess.dto';
import { RoundEntity } from './dto/round.entity';

@Injectable()
export class RoundsService {
  constructor(private readonly db: PrismaService) {}

  private userId(): string {
    return process.env.DEV_USER_ID ?? '00000000-0000-0000-0000-000000000000';
  }

  async start(dto: StartRoundDto): Promise<RoundEntity> {
    const round = await this.db.round.create({
      data: {
        userId: this.userId(),
        level: dto.level,
        contactId: dto.contactId,
        multiplicator: 1,
        turns: 0,
        status: 'running',
        startedAt: new Date(),
      },
    });
    return round as unknown as RoundEntity;
  }

  async reveal(roundId: string) {
    const round = await this.db.round.findUniqueOrThrow({
      where: { id: roundId },
    });
    const nextSeq = round.turns + 1;
    const msg = await this.db.message.findFirst({
      where: { contactId: round.contactId, level: round.level, seq: nextSeq },
      orderBy: { seq: 'asc' },
    });
    const newMult = Math.max(
      0,
      Math.round(Number(round.multiplicator) * 0.9 * 100) / 100,
    );
    const updated = await this.db.round.update({
      where: { id: roundId },
      data: { multiplicator: newMult, turns: nextSeq },
    });
    return {
      roundId,
      newMultiplicator: updated.multiplicator,
      turns: updated.turns,
      message: msg?.textFr ?? null,
    };
  }

  async guess(roundId: string, dto: GuessDto) {
    const round = await this.db.round.findUniqueOrThrow({
      where: { id: roundId },
    });
    if (round.status !== 'running') {
      return { round, delta: 0 };
    }
    if (dto.correct) {
      const gain = Math.max(10, Math.round(100 * Number(round.multiplicator)));
      const updated = await this.db.round.update({
        where: { id: roundId },
        data: { status: 'won', finishedAt: new Date() },
      });
      await this.db.scoreEvent.create({
        data: {
          userId: round.userId,
          roundId: round.id,
          type: 'guess',
          delta: gain,
        },
      });
      return { round: updated as unknown as RoundEntity, delta: gain };
    } else {
      const loss = -10;
      const newMult = Math.max(
        0,
        Math.round(Number(round.multiplicator) * 0.9 * 100) / 100,
      );
      const updated = await this.db.round.update({
        where: { id: roundId },
        data: { multiplicator: newMult },
      });
      await this.db.scoreEvent.create({
        data: {
          userId: round.userId,
          roundId: round.id,
          type: 'guess',
          delta: loss,
        },
      });
      return { round: updated as unknown as RoundEntity, delta: loss };
    }
  }
}
