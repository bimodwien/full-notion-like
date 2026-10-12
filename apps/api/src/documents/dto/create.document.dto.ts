import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
