import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/user.schema';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  budget: number;

  @Prop()
  deadline: Date;

  @Prop({ type: [String] })
  skillsRequired: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'Proposal' }])
  proposals: Types.ObjectId[];

  @Prop({ default: 'public', enum: ['public', 'invite-only'] })
  visibility: string;

  @Prop({ default: 'open', enum: ['open', 'closed'] })
  status: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
