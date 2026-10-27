import { IsBase64 } from 'class-validator';

export class UpdateDocumentContentDto {
  @IsBase64()
  state: string;
}
