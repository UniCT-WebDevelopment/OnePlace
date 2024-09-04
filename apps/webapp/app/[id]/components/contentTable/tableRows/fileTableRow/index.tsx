import { SelectedFileContext } from "@/app/components/provider";
import { ProviderContext } from "@/app/provider";
import Utils from "@/app/utils";
import { ModelFile } from "@/openapi/models/model-file";
import { Button, Checkbox, Dropdown, Table } from "flowbite-react";
import Link from "next/link";
import { useContext } from "react";
import { FileIcon } from "react-file-icon";
import { HiEllipsisHorizontal, HiPencil } from "react-icons/hi2";
import ShareFileDropdownItem from "./shareFileDropdownItem";

interface FileTableRowProps {
  file: ModelFile;
  onDelete: () => void;
}

export function FileTableRow({ file, onDelete }: FileTableRowProps) {
  const api = useContext(ProviderContext);
  const { setSelectedFile, deselectFile } = useContext(SelectedFileContext);
  const onClick = () => setSelectedFile(file);
  const ext = file.name.split('.').pop();

  return (
    <Table.Row
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
      onClick={onClick}
    >
      <Table.Cell className="flex gap-2 items-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <div className="w-[30px] m-[1px]">
          <FileIcon color='lavender' extension={ext} />
        </div>
        {file.name}
      </Table.Cell>
      <Table.Cell>{file.createdAt.toString().split('T')[0]}</Table.Cell>
      <Table.Cell>
        {Utils.formatBytes(file.size)}
      </Table.Cell>
      <Table.Cell>Privato</Table.Cell>
      <Table.Cell className="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0">
        <ul>
          <li>
            Delete
          </li>
          <ShareFileDropdownItem fileId={file.id} />
          <li>
            <Link href={`/documents/${file.id}`}>Open</Link>
          </li>
        </ul>
      </Table.Cell>
    </Table.Row>
  );
}
