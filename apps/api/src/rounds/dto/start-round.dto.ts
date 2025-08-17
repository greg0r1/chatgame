import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class StartRoundDto {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ example: 'curie' })
  @IsString()
  contactId: string;
}
