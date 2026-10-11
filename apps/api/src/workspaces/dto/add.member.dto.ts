import { IsEmail, IsIn } from 'class-validator';
import { Role } from '../../generated/prisma/enums';

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsIn([Role.EDITOR, Role.VIEWER])
  role: Role;
}
