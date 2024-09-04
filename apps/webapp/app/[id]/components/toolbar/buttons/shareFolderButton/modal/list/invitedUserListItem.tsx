import { ProviderContext } from "@/app/provider";
import { FolderUserPermissionPermissionEnum, InvitedUser, UpdateUserFolderPermissionInput, UpdateUserFolderPermissionInputPermissionEnum } from "@/openapi";
import { Button, List } from "flowbite-react";
import { ChangeEvent, useContext } from "react";

import { Description, Field, Label, Menu, MenuButton, MenuItem, MenuItems, Select } from '@headlessui/react'
import { HiChevronDown } from 'react-icons/hi2'

interface InvitedUserListItemProps {
  user: InvitedUser;
  folderId: string;
  onRemoved: () => void;
};

export function InvitedUserListItem({ user: invited, folderId, onRemoved }: InvitedUserListItemProps) {
  const { user, permission } = invited;
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
            const permission = event.target.value as UpdateUserFolderPermissionInputPermissionEnum;
            const input: UpdateUserFolderPermissionInput = { permission };
            api.share.shareControllerUpdateUserForFolder(input ,folderId, user.id).then(onRemoved);
          }}
          defaultValue={permission}
        >
          <option value={FolderUserPermissionPermissionEnum.Read}>Lettura</option>
          <option value={FolderUserPermissionPermissionEnum.Write}>Scrittura</option>
        </Select>
        <Button
          size="xs"
          color="red"
          onClick={() => api.share.shareControllerRemoveUserForFolder(folderId, user.id).then(onRemoved)}
        >
          Remove
        </Button>
      </div>
    </List.Item>
  );
}
