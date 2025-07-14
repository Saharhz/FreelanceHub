import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Proposal, ProposalDocument } from './proposal.schema';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectModel(Proposal.name)
    private proposalModel: Model<ProposalDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async create(jobId: string, freelancerId: string, dto: CreateProposalDto) {
    console.log('Creating proposal for', freelancerId, jobId, dto);
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');

    const existingProposal = await this.proposalModel.findOne({
      job: jobId,
      freelancer: freelancerId,
    });
    if (existingProposal) {
      throw new ForbiddenException('You have already applied to this job');
    }

    return this.proposalModel.create({
      job: jobId,
      freelancer: freelancerId,
      description: dto.description,
      estimatedBudget: dto.estimatedBudget,
    });
  }

  async getProposalsByFreelancer(freelancerId: string) {
    console.log('Fetching proposals for freelancer:', freelancerId);
    const proposals = await this.proposalModel
      .find({ freelancer: freelancerId })
      .populate('job');

    console.log('Returned proposals:', proposals);
    return proposals;
  }

  async getProposalsByClient(clientId: string) {
    const proposals = await this.proposalModel
      .find({ client: new Types.ObjectId(clientId) })
      .populate('job', 'title')
      .populate('freelancer', 'name email');

    console.log('📌 Proposals for this client:', proposals);

    return proposals;
  }

  // async getProposalsByClient(clientId: string) {
  //   const jobs = await this.jobModel.find({
  //     client: new Types.ObjectId(clientId),
  //   });
  //   const jobIds = jobs.map((job) => job._id);

  //   console.log('✅ Job IDs:', jobIds);

  //   const proposals = await this.proposalModel.find({});
  //   console.log('📌 All Proposals:', proposals);

  //   return this.proposalModel
  //     .find({ job: { $in: jobIds } })
  //     .populate('job', 'title')
  //     .populate('freelancer', 'name email');

  //   // return this.proposalModel
  //   //   .find({ job: { $in: jobIds } })
  //   //   .populate('proposals')
  //   //   .populate('freelancer', 'name email');
  // }

  async getProposalsByJob(jobId: string, clientId: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (job.clientId.toString() !== clientId.toString()) {
      throw new ForbiddenException('You do not own this job');
    }

    return this.proposalModel.find({ job: jobId }).populate('freelancer');
  }

  async findByJobId(jobId: string) {
    return this.proposalModel
      .find({ job: jobId })
      .populate('freelancer', 'name email');
  }
  async updateStatus(proposalId: string, status: 'accepted' | 'rejected') {
    return this.proposalModel
      .findByIdAndUpdate(proposalId, { status }, { new: true })
      .populate('freelancer', 'name email');
  }
}
