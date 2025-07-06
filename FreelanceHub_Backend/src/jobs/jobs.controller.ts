import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  BadRequestException,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobZod } from './dto/create-job.dto';
import { UpdateJobZod } from './dto/update-job.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';

@Controller('api/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles('client')
  async create(@Req() req, @Body() body) {
    const parse = CreateJobZod.safeParse(body);
    if (!parse.success) throw new BadRequestException(parse.error.format());

    return this.jobsService.createJob(parse.data, req.user._id);
  }

  @Get()
  async findAll() {
    return this.jobsService.getAllPublicJobs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Put(':id')
  @Roles('client')
  async update(@Req() req, @Param('id') id: string, @Body() body) {
    const parse = UpdateJobZod.safeParse(body);
    if (!parse.success) throw new BadRequestException(parse.error.format());

    return this.jobsService.updateJob(id, req.user._id, parse.data);
  }

  @Delete(':id')
  @Roles('client')
  async remove(@Req() req, @Param('id') id: string) {
    console.log('👤 Authenticated User:', req.user);
    const userId = req.user['sub'];
    return this.jobsService.deleteJob(id, req.user._id);
  }
}
