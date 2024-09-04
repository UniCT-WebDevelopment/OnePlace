"use client";

import { useContext, useEffect, useState } from "react";
import { Folder, SharedFile, SharedFolder } from "@/openapi";
import AppNavbar from "../components/navbar";
import { SelectedFileProvider } from "../components/provider";
import AppSidebar from "../components/sidebar";
import { ContentSidebar } from "../components/contentSidebar";
import { ProviderContext } from "../provider";
import { FolderTable } from "./folderTable";
import { FileTable } from "./fileTable";
import { Button } from "flowbite-react";

interface ContentPageProps {
  params: {
    id: string;
  };
}

export default function ContentPage({ params: { id } }: ContentPageProps) {
  const api = useContext(ProviderContext);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<SharedFile[]>([]);

  function fetchFolders() {
    api.shared
      .sharedControllerGetSharedFolders()
      .then((response) => setFolders(response.data.map((sharedFolder) => sharedFolder.folder)))
      .catch(console.error);
  }

  function fetchFiles() {
    api.shared
      .sharedControllerGetSharedFiles()
      .then((response) => setFiles(response.data))
      .catch(console.error);
  }

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [id]);

  return (
    <main className="h-screen">
      <AppNavbar />
      {folders && (
        <SelectedFileProvider>
          <div className="flex">
            <div className="hidden w-64 flex-none md:block">
              <AppSidebar />
            </div>
            <div className="w-64 grow gap-2 p-3">
              <h1 className="text-xl">Gestione Cartelle Condivise</h1>
              <ul className="my-3">
                {folders.map((folder) => (
                  <li key={folder.id}>
                    <span className="mr-2">{folder.name}</span>
                    <Button
                      outline
                      className="inline"
                      size="xs"
                      onClick={() => api.shared.sharedControllerLeaveSharedFolder(folder.id).then(fetchFolders)}
                    >
                      Esci Condivisione
                    </Button>
                  </li>
                ))}
              </ul>
              <h1 className="text-xl">Navigazione Cartelle</h1>
              <FolderTable folders={folders} onAction={fetchFolders} />
              <h1>File</h1>
              <FileTable files={files} onAction={fetchFiles} />
            </div>
            <div className="hidden w-64 flex-none xl:block">
              <ContentSidebar />
            </div>
          </div>
        </SelectedFileProvider>
      )}
    </main>
  );
}
