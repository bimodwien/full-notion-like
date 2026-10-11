import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { WorkspaceMembersService } from './workspaces.members.service';
import { WorkspaceMembersController } from './workspaces.members.controller';

@Module({
  providers: [WorkspacesService, WorkspaceMembersService],
  exports: [WorkspacesService],
  controllers: [WorkspacesController, WorkspaceMembersController],
  imports: [AuthModule, UsersModule],
})
export class WorkspacesModule {}
