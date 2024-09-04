import { ProviderContext } from "@/app/provider";
import { CreateFolderDto } from "@/openapi";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { HiOutlineFolderPlus } from "react-icons/hi2";

interface CreateFolderButtonProps {
  folderId: string;
  onCreated: () => void;
}

const CreateFolderButton: React.FC<CreateFolderButtonProps> = (props) => {
  const api = useContext(ProviderContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setFolderName(e.target.value);

  function createFolder() {
    const input: CreateFolderDto = {
      name: folderName,
      parentFolderId: props.folderId,
    };
    console.log("Creating folder", input);
    api.folder
      .folderControllerCreateFolder(input)
      .then(props.onCreated)
      .then(closeModal)
      .catch(console.error);
  }

  return (
    <>
      <Button outline onClick={showModal}>
        <HiOutlineFolderPlus className="size-6" />
      </Button>
      <Modal show={isModalVisible} onClose={closeModal}>
        <Modal.Body>
          <Label htmlFor="folderName">Folder Name</Label>
          <TextInput value={folderName} onChange={onChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Annulla</Button>
          <Button onClick={createFolder}>Crea Cartella</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateFolderButton;
