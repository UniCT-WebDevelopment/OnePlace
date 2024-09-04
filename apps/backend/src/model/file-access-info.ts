import { File, User } from "src/entities";
import { Permission } from "src/enum";

export class FileAccessInfo {
    file: File;
    user: User;
    permission: Permission;
}