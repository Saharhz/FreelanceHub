import { IsMongoId, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsMongoId()
  proposalId: string;

  @IsOptional()
  @IsString()
  deliverables?: string;

  @IsEnum(['active', 'completed', 'disputed'])
  status: 'active' | 'completed' | 'disputed';

  @IsOptional()
  @IsMongoId()
  jobId: string;
}
