import JSZip from "jszip";
import { Folder } from "../entities/folder.entity";
import { readFileSync } from "fs";

export class FolderUtils {
    static createZipFolder(zip: JSZip, folder: Folder) {
        const { files, subfolders } = folder;
        console.log(folder)
        if (files)
            files.forEach((file) => {
                const data = readFileSync(`data/${file.id}`);
                zip.file(file.name, data);
            });
        if (subfolders)
            subfolders.forEach((subfolder) => {
                const subZip = zip.folder(subfolder.name);
                this.createZipFolder(subZip, subfolder);
            });
    }
}