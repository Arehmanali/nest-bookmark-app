import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';
import { env } from 'process';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: env.DATABASE_URL,
        },
      },
    });
  }
}
