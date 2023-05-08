import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  signUp(reqBody) {
    return {
      status: 'success',
      message: 'You are Signed Up',
      reqBody: { ...reqBody },
    };
  }

  login() {
    return { status: 'success', message: 'You are Logged In' };
  }
}
