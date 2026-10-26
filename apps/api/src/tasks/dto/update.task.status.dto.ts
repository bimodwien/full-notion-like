import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../../generated/prisma/enums';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  // The cards that will sit directly above and below it; leave both out to go to the top.
  @IsOptional()
  @IsUUID()
  aboveId?: string;

  @IsOptional()
  @IsUUID()
  belowId?: string;
}
