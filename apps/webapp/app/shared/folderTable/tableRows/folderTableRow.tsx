import { ProviderContext } from "@/app/provider";
import { Folder, FolderUserPermission, SharedFolder } from "@/openapi";
import { Accordion, Button, Checkbox, Table } from "flowbite-react";
import { useContext } from "react";

interface FolderTableRowProps {
  folder: Folder;
}

export function FolderTableRow({ folder }: FolderTableRowProps) {
  return (
    <Accordion.Panel>
      <Accordion.Title>
        <FolderRow folder={folder} />
      </Accordion.Title>
      <Accordion.Content>
        { folder.subfolders.map((subfolder) => <FolderTableRow folder={subfolder} />) }
      </Accordion.Content>
    </Accordion.Panel>
  );
}

function FolderRow({ folder }: { folder: Folder }) {
  const api = useContext(ProviderContext);
  const onClick = () => (window.location.href = `/shared/${folder.id}`);
  return (
    <Table.Row
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
      onClick={onClick}
    >
      <Table.Cell className="p-4">
        <Checkbox />
      </Table.Cell>
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {folder.name}
      </Table.Cell>
      <Table.Cell>31/01/2001</Table.Cell>
      <Table.Cell>124.5 MB</Table.Cell>
      <Table.Cell>
        <Button
          size="xs"
          color="blue"
          onClick={async (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
          ) => {
            event.stopPropagation();
            const { data, headers } =
              await api.folder.folderControllerDownloadFolder(folder.id, {
                responseType: "blob",
              });
            const imageUrlObject = URL.createObjectURL(data!);
            const link = document.createElement("a");
            link.href = imageUrlObject;
            link.download = `${folder.name}.zip`;
            link.click();
            URL.revokeObjectURL(imageUrlObject);
          }}
        >
          Download
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}
