import { Repository, FindOneOptions, TreeRepository, Not, In } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SharedFolderInput } from "src/dto";
import { SharedFolder, SharedFile, FolderUserPermission, User, Folder, FileUserPermission } from "src/entities";
import { AuthService } from "./auth.service";
import { Permission } from "src/enum";


@Injectable()
export class SharedService {
    constructor(
        @InjectRepository(Folder)
        private readonly folders: TreeRepository<Folder>,
        @InjectRepository(SharedFolder)
        private readonly sharedFolders: Repository<SharedFolder>,
        @InjectRepository(SharedFile)
        private readonly sharedFiles: Repository<SharedFile>,
        @InjectRepository(FolderUserPermission)
        private readonly folderPermissions: Repository<FolderUserPermission>,
        @InjectRepository(FileUserPermission)
        private readonly filePermissions: Repository<FileUserPermission>,
    ) {}

    async getSharedFolders(user: User): Promise<SharedFolder[]> {
        const shared = await this.sharedFolders.find({
            where: { permissions: { user } },
            relations: {
                folder: { owner: true, subfolders: true, files: true }, 
                permissions: { user: true }
            }
        });
        for (const folder of shared)
            folder.folder = await this.folders.findDescendantsTree(folder.folder, { relations: ["owner", "subfolders", "files"] });

        return shared;
    }

    
    /**
     * Retrieves the shared files for a given user.
     * 
     * @param user - The user for whom to retrieve the shared files.
     * @returns A promise that resolves to an array of shared files.
     */
    getSharedFiles(user: User): Promise<SharedFile[]> {
        return this.sharedFiles.find({
            where: { permissions: { user } },
            relations: {
                file: true, 
                permissions: { user: true }
            }
        });
    }

    async leaveSharedFolder(user: User, folderId: string): Promise<void> {
        const permission = await this.folderPermissions.findOneOrFail({ 
            where: { userId: user.id, sharedFolderId: folderId },
            relations: ["sharedFolder"]
        })
        await this.folderPermissions.delete(permission);
    }
    
    async leaveSharedFile(user: User, fileId: string): Promise<void> {
        const permission = await this.filePermissions.findOneOrFail({ 
            where: { userId: user.id, sharedFileId: fileId },
            relations: ["sharedFile"]
        })
        await this.filePermissions.delete(permission);
    }
}