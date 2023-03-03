import { Controller, Post } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/uploads'
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){

    if( !file ) {
      throw new BadRequestException('Make a sure that the file is an image');
    }

    return {
      filename: file.originalname
    };
  }
}
