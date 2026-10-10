import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [WorkspacesService],
  exports: [WorkspacesService],
  controllers: [WorkspacesController],
  imports: [AuthModule],
})
export class WorkspacesModule {}
