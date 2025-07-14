import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from './proposal.schema';
import { ProposalsService } from './proposals.service';
import { JobsModule } from 'src/jobs/jobs.module';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proposal.name, schema: ProposalSchema },
      { name: Job.name, schema: JobSchema },
    ]),
    JobsModule,
  ],
  providers: [ProposalsService],
  controllers: [ProposalsController],
  exports: [MongooseModule, ProposalsService],
})
export class ProposalsModule {}
