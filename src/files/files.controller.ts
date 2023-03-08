import { Controller, Post, Get } from '@nestjs/common';
import { Param, Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage( 
      @Res() res: Response,
      @Param('imageName') imageName: string 
    ) {
    const path = this.filesService.getStaticProductImage( imageName );
    
    res.sendFile( path );
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){

    if( !file ) {
      throw new BadRequestException('Make a sure that the file is an image');
    }

    // const secureUrl = `${ file.filename }`;
    const secureUrl = `http://localhost:3000/api/files/product/8980de73-315a-4e7c-9b09-516ecf279229.png`;

    return {
      secureUrl
    };
  }
}
