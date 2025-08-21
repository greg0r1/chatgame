import { ApiProperty } from '@nestjs/swagger';

export class RevealResponseDto {
  @ApiProperty()
  roundId: string;

  @ApiProperty()
  newMultiplicator: number;

  @ApiProperty()
  turns: number;

  @ApiProperty({ example: { type: 'reveal', delta: 0 } })
  scoreEvent: { type: string; delta: number };
}
