import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient } from 'src/common/decorators/supabase.client';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.zip$/)) {
          return cb(
            new BadRequestException('Only .zip files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  // async create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: CreateSubmissionDto,
  // ) {
  //   const fileName = `submissions/${Date.now()}-${file.originalname}`;

  //   const supabase = getSupabaseClient();

  //   const { error } = await supabase.storage
  //     .from('submissions')
  //     .upload(fileName, file.buffer, {
  //       contentType: file.mimetype,
  //     });

  //   if (error) {
  //     throw new Error(`Upload failed: ${error.message}`);
  //   }

  //   const { data } = supabase.storage
  //     .from('submissions')
  //     .getPublicUrl(fileName);

  //   const deliverables = data.publicUrl;

  //   const proposal = await this.submissionsService.findProposalById(
  //     body.proposalId,
  //   );
  //   if (!proposal || !proposal.job) {
  //     throw new Error('Invalid proposal: no associated job found.');
  //   }

  //   const jobId = proposal.job;

  //   return this.submissionsService.create({ ...body, deliverables });
  // }
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateSubmissionDto,
  ) {
    const fileName = `submissions/${Date.now()}-${file.originalname}`;

    const supabase = getSupabaseClient();
    const { error } = await supabase.storage
      .from('submissions')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = supabase.storage
      .from('submissions')
      .getPublicUrl(fileName);

    const deliverables = data.publicUrl;

    // 🔥 Fetch jobId from proposal
    const proposal = await this.submissionsService.findProposalById(
      body.proposalId,
    );
    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }
    const jobId = proposal.job?._id?.toString(); // or proposal.job?.toString() if it's a raw ObjectId

    if (!jobId) {
      throw new BadRequestException('Job ID is missing in the proposal');
    }

    console.log('Proposal.job:', proposal.job);
    console.log('jobId:', jobId);

    return this.submissionsService.create({
      ...body,
      deliverables,
      jobId,
    });
  }

  @Get()
  async findAll() {
    const submissions = await this.submissionsService.findAll();
    console.log(JSON.stringify(submissions, null, 2));
    return submissions;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}
