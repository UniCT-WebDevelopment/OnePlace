import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Req, UseGuards, Param, Delete, Patch, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { InvitableUser, InvitedUser, UpdateUserFilePermissionInput, UpdateUserFolderPermissionInput } from 'src/dto';
import { ShareService } from 'src/service';
import { FileUserPermission, Folder, FolderUserPermission, User } from 'src/entities';

@ApiBearerAuth()
@ApiTags('share')
@Controller('share')
export class ShareController {
    constructor(private readonly shareService: ShareService) {}

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'id', required: true })
    @ApiResponse({ status: 200, description: 'Get users or sharing', type: InvitableUser, isArray: true })
    @Get('/folders/:id/users/invitable')
    getInvitableUsersForSharingFolder(
        @Req() req,
        @Param('id') folderId: string,
    ): Promise<User[]> {
        return this.shareService.getUsersForSharingFolder(req.user, folderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'id', required: true })
    @ApiResponse({ status: 200, description: 'Get users or sharing', type: InvitableUser, isArray: true })
    @Get('/files/:id/users/invitable')
    getInvitableUsersForSharingFile(
        @Req() req,
        @Param('id') folderId: string,
    ): Promise<User[]> {
        return this.shareService.getUsersForSharingFile(req.user, folderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'id', required: true })
    @ApiResponse({ status: 200, description: 'Get invited users', type: InvitedUser, isArray: true })
    @Post('/folders/:id/users/invited')
    getInvitedUsersForFolder(
        @Req() req,
        @Param('id') folderId: string,
    ): Promise<FolderUserPermission[]> {
        return this.shareService.getInvitedUsersForFolder(req.user, folderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'id', required: true })
    @ApiResponse({ status: 200, description: 'Get invited users', type: FileUserPermission, isArray: true })
    @Post('/files/:id/users/invited')
    getInvitedUsersForFile(
        @Req() req,
        @Param('id') folderId: string,
    ): Promise<FileUserPermission[]> {
        return this.shareService.getInvitedUsersForFile(req.user, folderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ type: InvitedUser })
    @ApiParam({ name: 'folderId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Post('/folders/:folderId/invite/:userId')
    inviteUserForFolder(
        @Req() req,
        @Param('folderId') folderId: string,
        @Param('userId') userId: string,
    ): Promise<InvitedUser> {
        return this.shareService.inviteUserForFolder(req.user, folderId, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBody({ type: UpdateUserFolderPermissionInput })
    @ApiParam({ name: 'folderId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Post('/folders/:folderId/invite/:userId/permission')
    updateUserForFolder(
        @Req() req,
        @Param('folderId') folderId: string,
        @Param('userId') userId: string,
        @Body() body: UpdateUserFolderPermissionInput,
    ): Promise<void> {
        return this.shareService.updateUserForFolder(req.user, folderId, userId, body.permission);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'folderId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Delete('/folders/:folderId/invite/:userId')
    removeUserForFolder(
        @Req() req,
        @Param('folderId') folderId: string,
        @Param('userId') userId: string,
    ): Promise<void> {
        return this.shareService.removeUserForFolder(req.user, folderId, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ type: InvitedUser })
    @ApiParam({ name: 'fileId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Post('/files/:fileId/invite/:userId')
    inviteUserForFile(
        @Req() req,
        @Param('fileId') fileId: string,
        @Param('userId') userId: string,
    ): Promise<InvitedUser> {
        return this.shareService.inviteUserForFile(req.user, fileId, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBody({ type: UpdateUserFilePermissionInput })
    @ApiParam({ name: 'fileId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Post('/files/:fileId/invite/:userId/permission')
    updateUserForFile(
        @Req() req,
        @Param('fileId') fileId: string,
        @Param('userId') userId: string,
        @Body() body: UpdateUserFilePermissionInput,
    ): Promise<void> {
        return this.shareService.updateUserForFile(req.user, fileId, userId, body.permission);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiParam({ name: 'fileId', required: true })
    @ApiParam({ name: 'userId', required: true })
    @Delete('/files/:fileId/invite/:userId')
    removeUserForFile(
        @Req() req,
        @Param('fileId') fileId: string,
        @Param('userId') userId: string,
    ): Promise<void> {
        return this.shareService.removeUserForFile(req.user, fileId, userId);
    }
}
