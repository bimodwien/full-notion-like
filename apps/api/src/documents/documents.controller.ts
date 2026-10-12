import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated.request';
import { WorkspaceMemberGuard } from '../workspaces/workspaces.member.guard';
import { RolesGuard } from '../workspaces/roles.guard';
import { Roles } from '../workspaces/roles.decorator';
import { Role } from '../generated/prisma/enums';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create.document.dto';
import { UpdateDocumentDto } from './dto/update.document.dto';

@UseGuards(JwtAuthGuard, WorkspaceMemberGuard, RolesGuard)
@Controller('workspaces/:workspaceId/documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Roles(Role.OWNER, Role.EDITOR)
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.create(
      workspaceId,
      req.user!.id,
      dto.title,
      dto.parentId,
    );
  }

  @Get()
  list(@Param('workspaceId') workspaceId: string) {
    return this.documentsService.list(workspaceId);
  }

  @Get(':documentId')
  findOne(
    @Param('workspaceId') workspaceId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.documentsService.findOne(workspaceId, documentId);
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Patch(':documentId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(
      workspaceId,
      documentId,
      dto.title,
      dto.parentId,
    );
  }

  @Roles(Role.OWNER, Role.EDITOR)
  @Delete(':documentId')
  @HttpCode(204)
  remove(
    @Param('workspaceId') workspaceId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ) {
    return this.documentsService.remove(workspaceId, documentId);
  }
}
