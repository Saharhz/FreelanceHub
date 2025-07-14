import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: 'ObjectId', ref: 'Proposal', required: true })
  proposalId: string;

  @Prop({ required: true })
  deliverables: string;

  @Prop({ type: 'ObjectId', ref: 'Job', required: true })
  jobId: string;

  @Prop({
    enum: ['active', 'completed', 'disputed'],
    default: 'active',
  })
  status: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
