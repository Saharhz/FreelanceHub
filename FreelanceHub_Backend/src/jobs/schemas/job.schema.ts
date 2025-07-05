// src/jobs/schemas/job.schema.ts
import { Schema, Types, model } from 'mongoose';

export const JobSchema = new Schema(
  {
    clientId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budget: { type: Number, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    visibility: {
      type: String,
      enum: ['public', 'invite-only'],
      default: 'public',
    },
    proposals: [{ type: Types.ObjectId, ref: 'Proposal' }],
    deadline: { type: Date, required: true },
  },
  { timestamps: true },
);
