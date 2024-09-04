import { ApiProperty } from '@nestjs/swagger';

export class InvitableUser {
    @ApiProperty()
    id: string;

    @ApiProperty()
    givenName: string;
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    picture;
}