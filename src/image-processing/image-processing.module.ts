import { Module } from '@nestjs/common';
import { ResizeController } from './resize/resize.controller';
import { ResizeService } from './resize/resize.service';

@Module({ controllers: [ResizeController], providers: [ResizeService] })
export class ImageProcessingModule {}
