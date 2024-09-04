import { ApiProperty } from '@nestjs/swagger';

export class Auth0User {
    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty({ name: 'family_name' })
    family_name: string;

    @ApiProperty()
    picture: string;

    @ApiProperty({ name: 'given_name' })
    given_name: string;

    @ApiProperty({ name: 'email_verified' })
    email_verified: boolean;

    @ApiProperty({ name: 'updated_at' })
    updated_at: string;

    @ApiProperty({ name: 'user_id' })
    user_id: string;

    @ApiProperty({ name: 'created_at' })
    created_at: string;

    @ApiProperty({ name: 'last_login' })
    last_login: string;

    @ApiProperty({ name: 'last_ip' })
    last_ip: string;

    @ApiProperty({ name: 'logins_count' })
    logins_count: number;
}