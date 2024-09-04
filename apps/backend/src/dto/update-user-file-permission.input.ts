import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "src/enum";

export class UpdateUserFilePermissionInput {
    @ApiProperty({ enum: Permission })
    permission: Permission;
}