import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProposalsService } from './proposals.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Controller('proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @Roles('freelancer')
  async applyToJob(
    @Body() body: CreateProposalDto & { jobId: string },
    @Req() req,
  ) {
    const freelancerId = req.user.sub;
    return this.proposalsService.create(body.jobId, freelancerId, body);
  }

  @Get('me')
  @Roles('freelancer')
  async getMyProposals(@Req() req: any) {
    const freelancerId = req.user.sub;
    return this.proposalsService.getProposalsByFreelancer(freelancerId);
  }

  @Get('client/me')
  @Roles('client')
  async getProposalsByClient(@Req() req: any) {
    const clientId = req.user.sub;
    return this.proposalsService.getProposalsByClient(clientId);
  }

  @Get('job/:jobId')
  @Roles('client')
  async getProposalsForJob(@Param('jobId') jobId: string) {
    console.log('Looking for proposals for job:', jobId);

    return this.proposalsService.findByJobId(jobId);
  }

  @Patch(':id/status')
  @Roles('client')
  async updateStatus(
    @Param('id') proposalId: string,
    @Body('status') status: 'accepted' | 'rejected',
  ) {
    return this.proposalsService.updateStatus(proposalId, status);
  }
}
