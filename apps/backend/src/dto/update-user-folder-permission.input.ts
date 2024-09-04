import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "src/enum";

export class UpdateUserFolderPermissionInput {
    @ApiProperty({ enum: Permission })
    permission: Permission;
}