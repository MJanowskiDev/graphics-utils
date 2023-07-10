import { Sharp } from 'sharp';

export type SharpWithOptions = Sharp & { options: { formatOut: string } };
export type File = Express.Multer.File;
export type Algorithm = (buffer: Buffer) => Sharp;
