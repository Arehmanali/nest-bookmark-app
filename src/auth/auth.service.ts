import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          updatedAt: new Date(),
        },
      });

      const token = await this.signToken(user.id, user.email);

      return {
        status: 'success',
        ...token,
      };
    } catch (error) {
      console.log('Hello', error.code);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exist!');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('User does not exist!');

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Password is incorrect!');

    const token = await this.signToken(user.id, user.email);
    return {
      status: 'success',
      message: 'You are Logged In',
      ...token,
    };
  }

  async signToken(
    userId: number,
    userEmail: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: userEmail,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { access_token: token };
  }
}
