import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../../generated/prisma/enums';

export class ListTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsUUID()
  documentId?: string;
}
