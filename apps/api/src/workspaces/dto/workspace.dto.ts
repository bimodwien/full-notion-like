import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class WorkSpaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
