import { ApiProperty } from '@nestjs/swagger';
import { RoundEntity } from './round.entity';

export class GuessResponse {
  @ApiProperty({ type: RoundEntity })
  round: RoundEntity;

  @ApiProperty()
  delta: number;
}
