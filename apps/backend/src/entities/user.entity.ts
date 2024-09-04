import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FolderUserPermission } from './folder-user-permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  auth0Id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  picture: string;

  @ApiProperty({ type: () => FolderUserPermission, isArray: true })
  @OneToMany(() => FolderUserPermission, permission => permission.user)
  sharedPermission: FolderUserPermission[];
}
