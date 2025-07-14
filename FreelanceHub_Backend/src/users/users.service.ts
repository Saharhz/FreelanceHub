import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { Proposal } from 'src/proposals/proposal.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Proposal.name) private proposalModel: Model<Proposal>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findProposalsByUser(userId: string) {
    return this.proposalModel.find({ freelancer: userId }).populate('job');
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
