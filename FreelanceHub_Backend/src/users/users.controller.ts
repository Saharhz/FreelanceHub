import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Body,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  UpdateUserDto,
  UpdateUserSchema,
} from 'src/validators/update-user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    console.log('👤 Current user in /me:', req.user);
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Get('me/proposals')
  @UseGuards(JwtAuthGuard)
  @Roles('freelancer')
  async getMyProposals(@Req() req: any) {
    return this.usersService.findProposalsByUser(req.user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const userId = req.user.sub;
    console.log('👤 Token payload:', req.user);
    console.log('📥 Reached updateMe endpoint');
    console.log('📝 Update body:', body);
    if (!userId) throw new UnauthorizedException('Invalid token payload');

    const updatedBody = {
      ...body,
      skills:
        typeof body.skills === 'string'
          ? body.skills.split(',').map((skill: string) => skill.trim())
          : body.skills,
    };
    return this.usersService.updateUser(userId, updatedBody);
  }
}
