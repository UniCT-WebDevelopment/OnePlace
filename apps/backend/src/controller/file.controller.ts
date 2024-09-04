import { Controller, Get, Post, Delete, Req, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { CreateFileDto } from 'src/dto';
import { FileService } from 'src/service';
import { File } from 'src/entities';

@ApiBearerAuth()
@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiResponse({ type: File, isArray: true })
  getAllFiles(@Req() req): Promise<File[]> {
    return this.fileService.findAll(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  uploadFile(
    @Req() req: { body: CreateFileDto; user: any },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.upload(req.user, file, req.body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteFile(@Req() req, @Param('id') id: string) {
    return this.fileService.remove(req.user, id);
  }
}
