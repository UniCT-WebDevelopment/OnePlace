import { Dropdown } from "flowbite-react";
import React, { useState } from "react";
import { ShareFileModal } from "./modal";

interface ShareFolderDowpdownItemProps {
  fileId: string;
}

const ShareFolderDowpdownItem: React.FC<ShareFolderDowpdownItemProps> = ({ fileId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <>
      <li onClick={showModal}>
        Condividi
      </li>
      <ShareFileModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        fileId={fileId}
      />
    </>
  );
};

export default ShareFolderDowpdownItem;
