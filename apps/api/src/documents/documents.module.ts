import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentContentService } from './documents.content.service';
import { DocumentContentController } from './documents.content.controller';

@Module({
  imports: [AuthModule, WorkspacesModule],
  providers: [DocumentsService, DocumentContentService],
  controllers: [DocumentsController, DocumentContentController],
})
export class DocumentsModule {}
