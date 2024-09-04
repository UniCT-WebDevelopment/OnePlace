import { Controller, Get, Post, Param, Delete, Body, UseGuards, Req, StreamableFile, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateFolderDto } from 'src/dto';
import { FolderService } from 'src/service';
import { Folder } from 'src/entities';


@ApiBearerAuth()
@ApiTags('folders')
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Get root folder', type: Folder })
  @Get('/home')
  getRootFolder(@Req() req): Promise<Folder> {
    return this.folderService.findRootFolder(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Get Folder', type: Folder })
  @Get(':id')
  getFolder(
    @Req() req,
    @Param('id') id: string,
  ): Promise<Folder> {
    return this.folderService.findFolder(req.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBody({ type: CreateFolderDto })
  @ApiResponse({ status: 201, description: 'Create folder', type: Folder })
  @Post()
  createFolder(@Req() req, @Body() createFolderDto: CreateFolderDto) {
    return this.folderService.create(req.user, createFolderDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Delete folder' })
  @Delete(':id')
  deleteFolder(@Req() req, @Param('id') id: string) {
    return this.folderService.remove(req.user, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Download folder' })
  @Get(':id/download')
  async downloadFolder(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Param('id') id: string
  ): Promise<StreamableFile> {
    const data = await this.folderService.download(req.user, id);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; inline; filename="${data.filename}"`,
    });
    return new StreamableFile(data.buffer);
  }
}
