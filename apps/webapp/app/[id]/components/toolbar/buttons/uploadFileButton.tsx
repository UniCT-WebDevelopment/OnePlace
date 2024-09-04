import { ProviderContext } from "@/app/provider";
import { Button, FileInput, Label, Modal, TextInput } from "flowbite-react";
import React, { ChangeEvent, useContext, useState } from "react";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";

interface UploadFileButtonProps {
  folderId: string;
  onUpload: () => void;
}

const UploadFileButton: React.FC<UploadFileButtonProps> = (props) => {
  const api = useContext(ProviderContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files == null) return console.error("FileList is null");
    const items = Array.from(files);
    setFiles(items);
  }

  async function upload() {
    async function uploadFile(file: File) {
      const form = new FormData();
      form.append("file", file);
      form.append("folderId", props.folderId);
      try {
        await api.file.fileControllerUploadFile({ data: form });
        props.onUpload();
      } catch (error) {
        console.error(error);
      }
    }
    for (const file of files) await uploadFile(file);
    closeModal();
  }

  return (
    <>
      <Button outline onClick={showModal}>
        <HiOutlineDocumentArrowUp className="size-6" />
      </Button>
      <Modal show={isModalVisible} onClose={closeModal}>
        <Modal.Body>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">Seleziona File</Label>
              <FileInput
                id="fileName"
                multiple={true}
                accept="file/*"
                onChange={handleFileSelected}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Annulla</Button>
          <Button onClick={upload} disabled={files.length==0}>Carica File</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadFileButton;
