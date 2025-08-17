import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class GuessDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  correct: boolean;
}
