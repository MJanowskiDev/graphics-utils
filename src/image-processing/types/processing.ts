import { Archiver } from 'archiver';
import { Sharp } from 'sharp';

export type ProcessingResult = {
  output: Buffer | Archiver;
  fileName: string;
  mime: string;
};

export type SharpWithOptions = Sharp & { options: { formatOut: string } };
export type File = Express.Multer.File;
export type Algorithm = (buffer: Buffer) => Sharp;
