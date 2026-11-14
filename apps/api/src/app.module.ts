import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { DocumentsModule } from './documents/documents.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      { name: 'burst', ttl: 60_000, limit: 5 },
      { name: 'hourly', ttl: 3_600_000, limit: 20 },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    WorkspacesModule,
    DocumentsModule,
    TasksModule,
  ],
})
export class AppModule {}
