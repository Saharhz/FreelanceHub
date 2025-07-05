import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel('Job') private jobModel: Model<any>) {}

  async createJob(createDto: CreateJobDto, clientId: string) {
    return await this.jobModel.create({ ...createDto, clientId });
  }
  async getAllPublicJobs() {
    return this.jobModel
      .find({ visibility: 'public', status: 'open' })
      .populate('clientId');
  }

  async getJobById(id: string) {
    return this.jobModel.findById(id).populate('clientId');
  }

  async updateJob(id: string, clientId: string, updateDto: UpdateJobDto) {
    return this.jobModel.findOneAndUpdate({ _id: id, clientId }, updateDto, {
      new: true,
    });
  }

  async deleteJob(id: string, clientId: string) {
    return this.jobModel.findOneAndDelete({ _id: id, clientId });
  }
}
