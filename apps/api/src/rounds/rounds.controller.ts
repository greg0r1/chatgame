import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StartRoundDto } from './dto/start-round.dto';
import { GuessDto } from './dto/guess.dto';
import { RevealResponse } from './dto/reveal.response';
import { GuessResponse } from './dto/guess.response';
import { RoundEntity } from './dto/round.entity';

@ApiTags('Rounds')
@Controller('v1/rounds')
export class RoundsController {
  constructor(private readonly svc: RoundsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer un round' })
  @ApiResponse({ status: 201, type: RoundEntity })
  start(@Req() req: any, @Body() body: StartRoundDto) {
    const userId = req.user?.id ?? process.env.DEV_USER_ID!;
    return this.svc.start(userId, body.level, body.contactId);
  }

  @Post(':id/reveal')
  @ApiOperation({ summary: 'Révéler un message et diminuer le multiplicateur' })
  @ApiResponse({ status: 200, type: RevealResponse })
  async reveal(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<RevealResponse> {
    const userId = req.user?.id ?? process.env.DEV_USER_ID!;
    const r = await this.svc.reveal(userId, id);
    return {
      roundId: r.id,
      newMultiplicator: Number(r.multiplicator),
      turns: r.turns,
      scoreEvent: { type: 'reveal', delta: 0 },
    };
  }

  @Post(':id/guess')
  @ApiOperation({ summary: 'Proposer une réponse' })
  @ApiResponse({ status: 200, type: GuessResponse })
  guess(@Req() req: any, @Param('id') id: string, @Body() body: GuessDto) {
    const userId = req.user?.id ?? process.env.DEV_USER_ID!;
    return this.svc.guess(userId, id, body.correct);
  }
}
