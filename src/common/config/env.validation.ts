import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

class EnvVars {
  @IsOptional()
  @IsInt()
  @Min(1)
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  OLLAMA_BASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  OLLAMA_MODEL!: string;

  @IsString()
  @IsNotEmpty()
  GRID_BASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  GRID_API_KEY!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, config, {
    enableImplicitConversion: true,
  });

  const { validateSync } = require('class-validator');
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `ENV validation failed:\n${errors
        .map((e) => JSON.stringify(e.constraints))
        .join('\n')}`,
    );
  }

  return validated;
}
