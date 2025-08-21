import { ApiProperty } from '@nestjs/swagger';
import { RoundEntity } from './round.entity';

export class GuessResponseDto {
  @ApiProperty({ type: RoundEntity })
  round: RoundEntity;

  @ApiProperty()
  delta: number;
}
