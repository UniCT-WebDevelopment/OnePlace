import { Folder, SharedFile, SharedFolder } from "@/openapi";
import { Checkbox, Table } from "flowbite-react";
import { FolderTableRow } from "./tableRows/folderTableRow";
import { FileTableRow } from "./tableRows/fileTableRow";

interface ContentTableProps {
  files: SharedFile[];
  onAction: () => void;
}

export function FileTable({ files, onAction }: ContentTableProps) {
  return (
    <div className="overflow-x-auto py-3">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nome</Table.HeadCell>
          <Table.HeadCell>Ultima Modifica</Table.HeadCell>
          <Table.HeadCell>Dimensione File</Table.HeadCell>
          <Table.HeadCell>Azioni</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {files.map((file) => (
            <FileTableRow
              key={"usr-folder-" + file.fileId}
              file={file.file}
              onDelete={onAction}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
