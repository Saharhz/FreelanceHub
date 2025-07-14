import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { Job } from 'src/jobs/schemas/job.schema';
import { User } from 'src/users/user.schema';

export type ProposalDocument = Proposal & Document;

@Schema()
export class Proposal {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  freelancer: Types.ObjectId;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number })
  estimateBudget?: number;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'rejected';
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);
