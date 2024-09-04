import { Folder } from "@/openapi";
import { Checkbox, Table } from "flowbite-react";
import { FolderTableRow } from "./tableRows/folderTableRow";
import { FileTableRow } from "./tableRows/fileTableRow";

interface ContentTableProps {
  folder: Folder;
  onAction: () => void;
}

export function ContentTable(props: ContentTableProps) {
  const { subfolders, files } = props.folder;

  const isParentShare = !(props.folder.share == null)

  const isEmpty = subfolders.length === 0 && files.length === 0;

  return (
    <div className="overflow-x-auto py-3">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Nome</Table.HeadCell>
          <Table.HeadCell>
            Data Creazione
          </Table.HeadCell>
          <Table.HeadCell>
            Dimensione
          </Table.HeadCell>
          <Table.HeadCell>Condivisione</Table.HeadCell>
          <Table.HeadCell className="flex items-center justify-end px-4 py-3">
            Actions
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {isEmpty && (
            <Table.Row>
              <Table.Cell colSpan={6} className="py-4 text-center">
                Questa Cartella è vuota.
                <br />
                Aggiungi dei file o delle cartelle
              </Table.Cell>
            </Table.Row>
          )}
          {subfolders.map((folder) => (
            <FolderTableRow key={"sub-" + folder.id} folder={folder} isParentShare={isParentShare} />
          ))}
          {files.map((file) => (
            <FileTableRow
              key={"file-" + file.id}
              file={file}
              onDelete={props.onAction}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
