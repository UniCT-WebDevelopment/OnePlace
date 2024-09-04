import { Entity, PrimaryColumn, JoinColumn, OneToOne, ManyToOne, Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { SharedFolder } from "./shared-folder.entity";
import { Permission } from "src/enum";
import { User } from "./user.entity";

@Entity()
export class FolderUserPermission {
    @ApiProperty()
    @PrimaryColumn()
    userId: string;
    
    @PrimaryColumn()
    sharedFolderId: string;
    
    @ApiProperty({ type: () => User })
    @JoinColumn({ name: 'userId' })
    @OneToOne(() => User)
    user: User;
    
    @JoinColumn({ name: 'sharedFolderId' })
    @ManyToOne(() => SharedFolder)
    sharedFolder: SharedFolder;
    
    @ApiProperty({ enum: Permission })
    @Column()
    permission: Permission;
}
