import { ProviderContext } from "@/app/provider";
import { FileUserPermission, FileUserPermissionPermissionEnum, InvitableUser, InvitedUser, UpdateUserFilePermissionInput, UpdateUserFilePermissionInputPermissionEnum } from "@/openapi";
import { Select } from "@headlessui/react";
import { Button, List } from "flowbite-react";
import { useContext } from "react";

interface InvitedUserListItemProps {
  userPermission: FileUserPermission;
  fileId: string;
  onRemoved: () => void;
}

export function InvitedUserListItem({ userPermission, fileId, onRemoved }: InvitedUserListItemProps) {
  const { user, permission } = userPermission;
  const api = useContext(ProviderContext);
  return (
    <List.Item className="group rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 sm:p-4">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <img
          className="h-10 w-10 rounded-full"
          src={user.picture}
          alt={user.name}
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {user.name} {user.name}
          </p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {user.id}
          </p>
        </div>
        <Select
          onChange={(event) => {
            const permission = event.target.value as UpdateUserFilePermissionInputPermissionEnum;
            const input: UpdateUserFilePermissionInput = { permission };
            api.share.shareControllerUpdateUserForFile(input ,fileId, user.id).then(onRemoved);
          }}
          defaultValue={permission}
        >
          <option value={FileUserPermissionPermissionEnum.Read}>Lettura</option>
          <option value={FileUserPermissionPermissionEnum.Write}>Scrittura</option>
        </Select>
        <Button size="xs" color="red" onClick={() => api.share.shareControllerRemoveUserForFile(fileId, user.id).then(onRemoved)}>
          Remove
        </Button>
      </div>
    </List.Item>
  );
}
