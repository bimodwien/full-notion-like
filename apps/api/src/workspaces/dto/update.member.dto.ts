import { IsIn } from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class UpdateMemberDto {
  @IsIn([Role.EDITOR, Role.VIEWER])
  role: Role;
}
