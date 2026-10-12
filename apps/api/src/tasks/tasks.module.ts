import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [AuthModule, WorkspacesModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
