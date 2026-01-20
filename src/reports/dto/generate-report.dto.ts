import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export enum GameDto {
  VALORANT = 'VALORANT',
  CS2 = 'CS2',
  DOTA2 = 'DOTA2',
  LOL = 'LOL',
}

export class GenerateReportDto {
  @IsString()
  @IsNotEmpty()
  teamId!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  matchCount!: number;

  @IsEnum(GameDto)
  game!: GameDto;
}
