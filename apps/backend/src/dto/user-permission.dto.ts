import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "src/enum";

export class UserPermissionDto {
    @ApiProperty()
    userId: string;

    @ApiProperty({ type: Permission })
    permission: Permission
}