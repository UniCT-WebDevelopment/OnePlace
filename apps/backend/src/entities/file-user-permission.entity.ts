import { Entity, PrimaryColumn, JoinColumn, OneToOne, ManyToOne, Column } from "typeorm";

import { SharedFile } from "./shared-file.entity";
import { Permission } from "src/enum";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class FileUserPermission {
    @PrimaryColumn()
    userId: string;
    
    @PrimaryColumn()
    sharedFileId: string;
    
    @ApiProperty({ type: () => User })
    @JoinColumn({ name: 'userId' })
    @OneToOne(() => User)
    user: User;
    
    @JoinColumn({ name: 'sharedFileId' })
    @ManyToOne(() => SharedFile)
    sharedFile: SharedFile;
    
    @ApiProperty({ enum: Permission })
    @Column()
    permission: Permission;
}

