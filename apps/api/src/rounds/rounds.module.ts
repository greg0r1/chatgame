import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';

@Module({
  controllers: [RoundsController],
  providers: [RoundsService, PrismaService],
})
export class RoundsModule {}
