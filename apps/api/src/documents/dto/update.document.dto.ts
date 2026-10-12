import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  // undefined = tidak diubah, null = pindah ke level atas
  @IsOptional()
  @IsUUID()
  parentId?: string | null;
}
