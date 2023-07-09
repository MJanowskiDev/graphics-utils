import { IsNotEmpty, Matches } from 'class-validator';

export class ConvertDto {
  @IsNotEmpty()
  @Matches(/png|jpeg|gif|webp|avif|tiff/)
  format: 'png' | 'jpeg' | 'gif' | 'webp' | 'avif' | 'tiff';
}
