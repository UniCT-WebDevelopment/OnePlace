import { SelectedFileContext } from "@/app/components/provider";
import { ProviderContext } from "@/app/provider";
import Utils from "@/app/utils";
import { ModelFile } from "@/openapi";
import { Button, Checkbox, Table } from "flowbite-react";
import { useContext } from "react";

interface FileTableRowProps {
  file: ModelFile;
  onDelete: () => void;
}

export function FileTableRow({ file, onDelete }: FileTableRowProps) {
  const api = useContext(ProviderContext);
  const { setSelectedFile, deselectFile } = useContext(SelectedFileContext);
  const onClick = () => setSelectedFile(file);

  return (
    <Table.Row
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
      onClick={onClick}
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {file.name}
      </Table.Cell>
      <Table.Cell>{new Date(file.createdAt).toLocaleDateString('it')}</Table.Cell>
      <Table.Cell>{Utils.formatBytes(file.size)}</Table.Cell>
      <Table.Cell>
        <Button
          className="inline-block m-1"
          size="xs"
          onClick={() => {
            api.shared.sharedControllerLeaveSharedFile(file.id)
              .then(deselectFile)
              .then(onDelete);
          }}
        >
          Esci dalla Condivisione
        </Button>
        <Button
        className="inline-block m-1"
          size="xs"
          href={`/documents/${file.id}`}
        >
          Apri File
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}
