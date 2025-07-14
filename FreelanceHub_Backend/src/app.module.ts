import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { JobsModule } from './jobs/jobs.module';
// import { JobsController } from './jobs/jobs.controller';
import { ProposalsService } from './proposals/proposals.service';
import { ProposalsModule } from './proposals/proposals.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    AuthModule,
    UsersModule,
    JobsModule,
    ProposalsModule,
    SubmissionsModule,
  ],
  providers: [EmailService, ProposalsService],
  exports: [EmailService],
  // controllers: [JobsController],
})
export class AppModule {}
