import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { SharedFile, SharedFolder } from 'src/entities';
import { SharedService } from 'src/service';

/**
 * Controller for accessing shared resources
 */
@ApiTags('shared')
@Controller('shared')
export class SharedController {
    constructor(
        private readonly sharedService: SharedService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Get shared folders', type: SharedFolder, isArray: true })
    @Get('folders')
    getSharedFolders(@Req() req): Promise<SharedFolder[]> {
        return this.sharedService.getSharedFolders(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Get shared files', type: SharedFile, isArray: true })
    @Get('files')
    getSharedFiles(@Req() req): Promise<SharedFile[]> {
        return this.sharedService.getSharedFiles(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'LeaveSharedFolder' })
    @ApiParam({ name: 'id', required: true })
    @Delete('folders/:id/leave')
    leaveSharedFolder(@Req() req, @Param('id') folderId: string): Promise<void> {
        return this.sharedService.leaveSharedFolder(req.user, folderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'LeaveSharedFile' })
    @ApiParam({ name: 'id', required: true })
    @Delete('files/:id/leave')
    leaveSharedFile(@Req() req, @Param('id') fileId: string): Promise<void> {
        return this.sharedService.leaveSharedFile(req.user, fileId);
    }

}