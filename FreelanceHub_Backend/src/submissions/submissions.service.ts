import { Injectable, NotFoundException } from '@nestjs/common';
import { Submission } from './submission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Proposal, ProposalDocument } from 'src/proposals/proposal.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<Submission>,
    @InjectModel(Proposal.name)
    private proposalModel: Model<ProposalDocument>,
  ) {
    console.log('✅ SubmissionModel injected');
  }

  async findProposalById(proposalId: string) {
    return this.proposalModel.findById(proposalId).populate('job');
  }

  async create(createDto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionModel.create(createDto);
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel
      .find()
      .populate({
        path: 'proposalId',
        populate: [{ path: 'job' }, { path: 'freelancer' }],
      })
      .exec();
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionModel
      .findById(id)
      .populate({
        path: 'proposalId',
        populate: [{ path: 'job' }, { path: 'freelancer' }],
      })
      .exec();

    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async update(
    id: string,
    updateDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    const updated = await this.submissionModel.findByIdAndUpdate(
      id,
      updateDto,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException('Submission not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.submissionModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Submission not found');
  }
}
