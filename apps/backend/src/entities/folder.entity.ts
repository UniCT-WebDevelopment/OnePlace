import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Tree, TreeChildren, TreeParent, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SharedFolder } from './shared-folder.entity';
import { User } from './user.entity';
import { File } from './file.entity';

@Entity()
@Tree("closure-table")
export class Folder {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @ApiProperty({ type: () => Folder })
  @TreeParent()
  parent: Folder;

  @ManyToOne(() => User)
  owner: User;

  @ApiProperty({ type: () => Folder, isArray: true })
  @TreeChildren()
  subfolders: Folder[];

  @ApiProperty({ type: () => File, isArray: true })
  @OneToMany(() => File, file => file.folder)
  files: File[];

  @ApiProperty({ type: () => SharedFolder })
  @OneToOne(() =>  SharedFolder, share => share.folder)
  share: SharedFolder
}
