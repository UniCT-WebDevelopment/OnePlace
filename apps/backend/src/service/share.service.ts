import { Repository, FindOneOptions, TreeRepository, Not, In, Entity, EntityNotFoundError, EntityPropertyNotFoundError } from "typeorm";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SharedFolderInput } from "src/dto";
import { SharedFolder, SharedFile, FolderUserPermission, User, Folder, File, FileUserPermission } from "src/entities";
import { AuthService } from "./auth.service";
import { Permission } from "src/enum";


@Injectable()
export class ShareService {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
        @InjectRepository(Folder)
        private readonly folders: TreeRepository<Folder>,
        @InjectRepository(File)
        private readonly files: TreeRepository<File>,
        @InjectRepository(User)
        private readonly users: Repository<User>,
        @InjectRepository(SharedFolder)
        private readonly sharedFoldersRepo: Repository<SharedFolder>,
        @InjectRepository(SharedFile)
        private readonly sharedFilesRepo: Repository<SharedFile>,
        @InjectRepository(FolderUserPermission)
        private readonly folderUserPermission: Repository<FolderUserPermission>,
        @InjectRepository(FileUserPermission)
        private readonly fileUserPermission: Repository<FileUserPermission>,
    ) {}

    get() {
        return {
            from: [],
            to: [],
            others: [],
        }
    }
    
    getInvitedUsersForFolder(owner: User, folderId: string): Promise<FolderUserPermission[]> {
        return this.folderUserPermission.find(({
            where: { sharedFolder: { folder: { owner, id: folderId } } },
            relations: { user: true, sharedFolder: { folder: { owner: true } } }
        }))
    }
    
    async getInvitedUsersForFile(owner: User, fileId: string): Promise<FileUserPermission[]> {
        try {
            return await this.fileUserPermission.find(({
                where: { sharedFileId: fileId, sharedFile: { file: { folder: { owner } }}  },
                relations: { sharedFile: { file: { folder: { owner: true } }, permissions: { user: true } }, user: true }
            }));
        } catch (error) {
            if (error instanceof EntityPropertyNotFoundError) {
                console.error(error.message);
                return [];
            }
            throw error;
        }
    }

    async createSharedFolder(owner: User, folderId: string): Promise<SharedFolder> {
        const folder = await this.folders.findOneOrFail({ where: { owner, id: folderId } });
        const createdSharedFolder = this.sharedFoldersRepo.create({ folder });
        return await this.sharedFoldersRepo.save(createdSharedFolder);
    }

    async createSharedFile(owner: User, fileId: string): Promise<SharedFile> {
        const file = await this.files.findOneOrFail({ 
            where: { id: fileId, folder: { owner } },
            relations: { folder: { owner: true } },
        });
        const createdSharedFile = this.sharedFilesRepo.create({ file });
        return await this.sharedFilesRepo.save(createdSharedFile);
    }

    createPermissionForFolder(sharedFolder: SharedFolder, userId: string, permission: Permission): Promise<FolderUserPermission> {
        const input = { permission: permission, sharedFolder, userId: userId };
        const created = this.folderUserPermission.create(input);
        return this.folderUserPermission.save(created);
    }

    createPermissionForFile(sharedFile: SharedFile, userId: string, permission: Permission): Promise<FileUserPermission> {
        const input = { permission: permission, sharedFile, userId: userId };
        const created = this.fileUserPermission.create(input);
        return this.fileUserPermission.save(created);
    }

    async inviteUserForFolder(owner: User, folderId: string, userId: string): Promise<FolderUserPermission> {
        const sharedFolder = await this.sharedFoldersRepo.findOne({
            where: { folder: { owner, id: folderId } },
            relations: { folder: true, permissions: { user: true } }
        });
        if (sharedFolder == null) {
            const sharedFolder = await this.createSharedFolder(owner, folderId);
            return await this.createPermissionForFolder(sharedFolder, userId, Permission.Read);
        } else {
            const permission = await this.folderUserPermission.findOneBy({ userId, sharedFolderId: sharedFolder.id });
            if (permission == null) return await this.createPermissionForFolder(sharedFolder, userId, Permission.Read);
            return permission;
        }
    }

    async updateUserForFolder(owner: User, folderId: string, userId: string, permission: Permission): Promise<void> {
        const sharedFolder = await this.sharedFoldersRepo.findOne({
            where: { folder: { owner, id: folderId } },
            relations: { folder: true, permissions: { user: true } }
        });
        if (sharedFolder == null) throw new NotFoundException();
        const folderPermission = await this.folderUserPermission.findOneBy({ userId, sharedFolderId: sharedFolder.id });
        folderPermission.permission = permission;
        await this.folderUserPermission.save(folderPermission);
    }

    async removeUserForFolder(owner: User, folderId: string, userId: string): Promise<void> {
        const sharedFolder = await this.sharedFoldersRepo.findOne({
            where: { folder: { owner, id: folderId } },
            relations: { folder: true, permissions: { user: true } }
        });
        if (sharedFolder == null) throw new NotFoundException();
        const permission = await this.folderUserPermission.findOneBy({ userId, sharedFolderId: sharedFolder.id });
        await this.folderUserPermission.delete(permission);
    }

    async inviteUserForFile(owner: User, fileId: string, userId: string): Promise<FileUserPermission> {
        const sharedFile = await this.sharedFilesRepo.findOne({
            where: { file: { folder: { owner }, }, fileId },
            relations: { file: { folder: { owner: true } }, permissions: { user: true } }
        });
        if (sharedFile == null) {
            const sharedFile = await this.createSharedFile(owner, fileId);
            return await this.createPermissionForFile(sharedFile, userId, Permission.Read);
        } else {
            const permission = await this.fileUserPermission.findOneBy({ userId, sharedFileId: sharedFile.fileId });
            if (permission == null) return await this.createPermissionForFile(sharedFile, userId, Permission.Read);
            return permission;
        }
    }

    async updateUserForFile(owner: User, fileId: string, userId: string, permission: Permission): Promise<void> {
        const sharedFile = await this.sharedFilesRepo.findOne({
            where: { file: { folder: { owner }, }, fileId },
            relations: { file: { folder: { owner: true } }, permissions: { user: true } }
        });
        if (sharedFile == null) throw new NotFoundException();
        const filePermission = await this.fileUserPermission.findOneBy({ userId, sharedFileId: sharedFile.fileId });
        filePermission.permission = permission;
        await this.fileUserPermission.save(filePermission);
    }

    async removeUserForFile(owner: User, fileId: string, userId: string): Promise<void> {
        const sharedFile = await this.sharedFilesRepo.findOne({
            where: { file: { folder: { owner }, }, fileId },
            relations: { file: { folder: { owner: true } }, permissions: { user: true } }
        });
        if (sharedFile == null) throw new NotFoundException(); 
        const permission = await this.fileUserPermission.findOneBy({ userId, sharedFileId: sharedFile.fileId });
        await this.fileUserPermission.delete(permission);
    }

    async getUsersForSharingFolder(owner: User, folderId): Promise<User[]> {
        const sharedFolder = await this.sharedFoldersRepo.findOne({ 
            where: { folder: { owner, id: folderId } },
            relations: { folder: true, permissions: { user: true } }
        });
        if (sharedFolder == null) return await this.users.find({ where: { id: Not(owner.id) } });
        const excludedIDs = sharedFolder.permissions.map(({ user }) => user.id).concat(owner.id);
        return await this.users.findBy({ id: Not(In(excludedIDs)) });
    }

    async getUsersForSharingFile(owner: User, fileId): Promise<User[]> {
        const sharedFile = await this.sharedFilesRepo.findOne({ 
            where: { file: { folder: { owner }, id: fileId } },
            relations: { file: { folder: { owner: true } }, permissions: { user: true } }
        });
        if (sharedFile == null) return await this.users.find({ where: { id: Not(owner.id) } });
        const excludedIDs = sharedFile.permissions.map(({ user }) => user.id).concat(owner.id);
        return await this.users.findBy({ id: Not(In(excludedIDs)) });
    }

    async sharedFolder(owner: User, input: SharedFolderInput) {
        // const folder = await this.folders.findFolder(owner, folderId);
    }
}