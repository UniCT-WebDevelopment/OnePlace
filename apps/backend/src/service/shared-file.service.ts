import { Repository, FindOneOptions, TreeRepository, Not, In } from "typeorm";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SharedFolderInput } from "src/dto";
import { SharedFolder, SharedFile, FolderUserPermission, User, Folder, File } from "src/entities";
import { AuthService } from "./auth.service";
import { Permission } from "src/enum";
import { FileAccessInfo } from "src/model/file-access-info";


@Injectable()
export class SharedFileService {
    constructor(
        @InjectRepository(Folder)
        private readonly folders: TreeRepository<Folder>,
        @InjectRepository(File)
        private readonly file: Repository<File>,
        @InjectRepository(SharedFolder)
        private readonly sharedFolders: Repository<SharedFolder>,
        @InjectRepository(SharedFile)
        private readonly sharedFiles: Repository<SharedFile>,
    ) {}

    async isSharedFile(id: string) {}

    async isInsideSharedFolder(id: string) {}

    async get(user: User, id: string): Promise<FileAccessInfo> {
        const file = await this.file.findOneOrFail({ 
            where: { id }, 
            relations: { folder: { owner: true } } 
        });
        if (file.folder.owner.id == user.id) {
            const permission = Permission.Write;
            return { permission, file, user };
        }
        console.log(file, user);
        const sharedFile = await this.sharedFiles.findOne({
            where: { file, permissions: { user } },
            relations: { file: true, permissions: { user: true } }
        })
        if (sharedFile == null) throw new NotFoundException();
        const { permission } = sharedFile.permissions.find(permission => permission.user.id == user.id); 
        return { file, user, permission: permission };
    }
}