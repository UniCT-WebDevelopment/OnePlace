import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FolderService } from './folder.service';
import { CreateFileDto } from 'src/dto';
import { User, File } from 'src/entities';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @Inject(FolderService)
    private readonly folderService: FolderService,
  ) {
    const doesExistUploadDest = existsSync('data');
    if (!doesExistUploadDest) mkdirSync('data');
  }

  async findAll(user: User) {
    return this.fileRepository.find();
  }

  async upload(user: User, file: Express.Multer.File, createFileDto: CreateFileDto) {
    const folder = await this.folderService.findByUUID(user, createFileDto.folderId);
    const input = { name: file.originalname, size: file.size, mimeType: file.mimetype, folder };
    const created = await this.fileRepository.save(input);
    writeFileSync(`data/${created.id}`, file.buffer);
  }

  async remove(user: User, id: string) {
    const file = await this.fileRepository.findOne({
      select: { id: true , folder: { id: true, owner: { id: true }}},
      where: { id, folder: { owner: user } }, 
      relations: { folder: { owner: true }} }
    );
    if (file) {
      unlinkSync(`data/${file.id}`);
      await this.fileRepository.remove(file);
    }
  }
}
