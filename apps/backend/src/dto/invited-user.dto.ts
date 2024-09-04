import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';
import { Permission } from 'src/enum';

export class InvitedUser {
    @ApiProperty({ enum: Permission })
    permission: Permission;

    @ApiProperty({ type: User })
    user: User;
}