import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  UpdateUserDto,
  UpdateUserSchema,
} from 'src/validators/update-user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const userId = req.user['sub'];
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
