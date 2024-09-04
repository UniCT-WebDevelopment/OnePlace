import { Alert, Button, Label, List, Modal, TextInput } from "flowbite-react";
import { InvitableUserListItem } from "./list/invitableUserListItem";
import { useContext, useEffect, useState } from "react";
import { InvitableUser, InvitedUser } from "@/openapi";
import { ProviderContext } from "@/app/provider";
import { InvitedUserListItem } from "./list/invitedUserListItem";
import { HiClipboard, HiOutlineClipboard } from "react-icons/hi2";
import { CopyButton } from "@/app/components/copyButton";

interface ShareFolderModalProps {
  folderId: string;
  isModalVisible: boolean;
  closeModal: () => void;
}

export function ShareFolderModal(props: ShareFolderModalProps) {
  const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
  const api = useContext(ProviderContext);
  const [invitableUsers, setInvitableUsers] = useState<InvitableUser[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);

  async function getInvitableUser() {
    const { folderId } = props;
    const { data } =
      await api.share.shareControllerGetInvitableUsersForSharingFolder(folderId);
    setInvitableUsers(data);
  }

  async function getInvitedUser() {
    const { folderId } = props;
    const { data } = await api.share.shareControllerGetInvitedUsersForFolder(folderId);
    setInvitedUsers(data);
  }

  async function onInvite() {
    await getInvitedUser();
    await getInvitableUser();
  }

  useEffect(() => {
    if (api.loading) return;
    getInvitedUser();
    getInvitableUser();
  }, [api.loading]);

  const shareableLink = `${APP_BASE_URL}/shared/${props.folderId}`

  return (
    <Modal show={props.isModalVisible} onClose={props.closeModal}>
      <Modal.Body>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Link di Condivisione</Label>
            <div className="relative">
              <input
                type="text"
                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={shareableLink}
                disabled
                readOnly
              />
              <CopyButton copyLink={shareableLink} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>In Condivisione con</Label>
            <List
              unstyled
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {invitedUsers.length === 0 && (
                <Alert color="info">
                  <span className="font-medium">Stato Condivisione</span>:
                  Nessun utente ha accesso a questa cartella
                </Alert>
              )}
              {invitedUsers.map((user) => (
                <InvitedUserListItem
                  key={"modal-invited-" + user.user.id}
                  user={user}
                  folderId={props.folderId}
                  onRemoved={onInvite}
                />
              ))}
            </List>
          </div>
          <div className="space-y-2">
            <Label>Invita</Label>
            {/* <TextInput onChange={getInvitableUser} placeholder="Cerca Utenti" /> */}
            <List
              unstyled
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {invitableUsers.length === 0 && "Nessun Utente da poter invitare"}
              {invitableUsers.map((user) => (
                <InvitableUserListItem
                  key={"modal-invitable-" + user.id}
                  user={user}
                  folderId={props.folderId}
                  onInvite={onInvite}
                />
              ))}
            </List>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.closeModal}>Chiudi</Button>
      </Modal.Footer>
    </Modal>
  );
}
