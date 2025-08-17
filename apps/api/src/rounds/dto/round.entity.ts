import { ApiProperty } from '@nestjs/swagger';

export class RoundEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  contactId: string;

  @ApiProperty()
  multiplicator: number;

  @ApiProperty()
  turns: number;

  @ApiProperty({ enum: ['running', 'won', 'lost', 'aborted'] })
  status: 'running' | 'won' | 'lost' | 'aborted';

  @ApiProperty()
  startedAt: Date;

  @ApiProperty({ required: false })
  finishedAt?: Date;
}
