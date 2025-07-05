import {
  Controller,
  Body,
  Post,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { z } from 'zod';
import {
  LoginSchema,
  RegisterSchema,
  LoginDto,
  RegisterDto,
} from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    console.log('📥 Incoming register request:', body);
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const data: RegisterDto = parsed.data;
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() body: any) {
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const data: LoginDto = parsed.data;
    return this.authService.login(data);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
