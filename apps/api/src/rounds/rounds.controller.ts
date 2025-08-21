import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoundsService } from './rounds.service';
import { StartRoundDto } from './dto/start-round.dto';
import { GuessDto } from './dto/guess.dto';
import { RoundEntity } from './dto/round.entity';
import { RevealResponseDto } from './dto/reveal.response';
import { GuessResponseDto } from './dto/guess.response';

@ApiTags('rounds')
@Controller('v1/rounds')
export class RoundsController {
  constructor(private readonly service: RoundsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Démarrer un round' })
  start(@Body() dto: StartRoundDto): Promise<RoundEntity> {
    return this.service.start(dto);
  }

  @Post(':id/reveal')
  @ApiOperation({ summary: 'Révéler le prochain message' })
  reveal(@Param('id') id: string): Promise<RevealResponseDto> {
    return this.service.reveal(id) as unknown as Promise<RevealResponseDto>;
  }

  @Post(':id/guess')
  @ApiOperation({ summary: 'Proposer une réponse' })
  guess(
    @Param('id') id: string,
    @Body() dto: GuessDto,
  ): Promise<GuessResponseDto> {
    return this.service.guess(id, dto) as unknown as Promise<GuessResponseDto>;
  }
}
