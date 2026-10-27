import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { WorkspaceMemberGuard } from '../workspaces/workspaces.member.guard';
import { RolesGuard } from '../workspaces/roles.guard';
import { Roles } from '../workspaces/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { DocumentContentService } from './documents.content.service';
import { UpdateDocumentContentDto } from './dto/update.document.content.dto';

@UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
@Controller('workspaces/:workspaceId/documents/:documentId/content')
export class DocumentContentController {
  constructor(private contentService: DocumentContentService) {}

  @Get()
  load(
    @Param('workspaceId') workspaceId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.contentService.load(workspaceId, documentId);
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Put()
  @HttpCode(204)
  save(
    @Param('workspaceId') workspaceId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateDocumentContentDto,
  ) {
    return this.contentService.save(workspaceId, documentId, dto.state);
  }
}
