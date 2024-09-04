import { Entity, OneToOne, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Folder, FolderUserPermission } from 'src/entities';

@Entity()
export class SharedFolder {
    @PrimaryColumn()
    id: string;

    @ApiProperty({ type: () => Folder })
    @JoinColumn({ name: 'id' })
    @OneToOne(() => Folder, folder => folder.share)
    folder: Folder;

    @ApiProperty({ type: () => FolderUserPermission, isArray: true })
    @OneToMany(() => FolderUserPermission, userPermission => userPermission.sharedFolder)
    permissions: FolderUserPermission[];
}
