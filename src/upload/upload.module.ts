import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [CloudinaryService],
})
export class UploadModule {}
