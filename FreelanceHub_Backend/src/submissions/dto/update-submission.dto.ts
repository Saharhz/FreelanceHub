import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString()
  deliverables?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'disputed'])
  status?: 'active' | 'completed' | 'disputed';
}
