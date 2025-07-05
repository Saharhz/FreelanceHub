import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: ['client', 'freelancer'], required: true })
  role: 'client' | 'freelancer';

  @Prop()
  avatarUrl: string;

  @Prop()
  title?: string;

  @Prop([String])
  skills?: string[];

  @Prop()
  bio?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({
    type: {
      phone: String,
      website: String,
      linkedin: String,
    },
    default: {},
  })
  contactInfo?: {
    phone?: string;
    website?: string;
    linkedin?: string;
  };

  @Prop({ enum: ['free', 'pro'], default: 'free' })
  plan: 'free' | 'pro';
}

export const UserSchema = SchemaFactory.createForClass(User);
