import { ApiProperty } from "@nestjs/swagger";
import { UserPermissionDto } from "./user-permission.dto";

export class SharedFolderInput {
    @ApiProperty()
    folderId: string;

    @ApiProperty({ type: UserPermissionDto, isArray: true })
    userPermissions: UserPermissionDto[];
}