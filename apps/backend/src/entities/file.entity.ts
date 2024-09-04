import { ApiProperty } from '@nestjs/swagger';
import { Folder } from 'src/entities/folder.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class File {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: "timestamp", default: () => "now()" })
  createdAt: Date;

  @ApiProperty()
  @Column()
  size: number;

  @ApiProperty()
  @Column()
  mimeType: string;

  @ApiProperty({ type: () => Folder })
  @ManyToOne(() => Folder, folder => folder.files, { nullable: true })
  folder: Folder;
}
