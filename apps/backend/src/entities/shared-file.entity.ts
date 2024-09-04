import { Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { FileUserPermission } from "./file-user-permission.entity";
import { File } from "./file.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class SharedFile {
    @ApiProperty()
    @PrimaryColumn()
    fileId: string;

    @ApiProperty({ type: () => File})
    @OneToOne(() => File)
    @JoinColumn({ name: 'fileId' })
    file: File;

    @ApiProperty({ type: () => FileUserPermission, isArray: true })
    @OneToMany(() => FileUserPermission, userPermission => userPermission.sharedFile)
    permissions: FileUserPermission[];
}
