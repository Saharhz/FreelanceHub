import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Catch,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/user.model';
import { RegisterDto, LoginDto } from './schemas/auth.schemas';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto) {
    const { email, password, name, role } = data;

    const userExists = await this.userModel.findOne({ email: data.email });
    if (userExists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      isEmailVerified: false,
      plan: 'free',
    });

    const verifyToken = this.jwtService.sign(
      { sub: user._id },
      { expiresIn: '1d' },
    );

    const verifyLink = `http://localhost:3000/auth/verify?token=${verifyToken}`;

    await this.emailService.sendVerificationEmail(user.email, verifyLink);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first.');
    }

    const token = this.jwtService.sign({
      sub: user._id,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const newUser = await this.userModel.findById(payload.sub);

      if (!newUser) {
        throw new BadRequestException('Invalid verification link');
      }
      if (newUser.isEmailVerified) {
        return { message: 'Account already verified' };
      }
      newUser.isEmailVerified = true;
      await newUser.save();

      return { message: 'Email verified successfully. You can now log in.' };
    } catch (err) {
      throw new BadRequestException('Verification link expired or invalid');
    }
  }

  private signToken(user: UserDocument) {
    const payload = { sub: user._id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
