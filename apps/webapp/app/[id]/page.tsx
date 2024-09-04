"use client";

import { useContext, useEffect, useState } from "react";
import { AppBreadcrumb } from "../components/breadcrumb";
import { ContentSidebar } from "../components/contentSidebar";
import { ContentTable } from "./components/contentTable";
import AppNavbar from "../components/navbar";
import AppSidebar from "../components/sidebar";
import { Toolbar } from "./components/toolbar";
import { ProviderContext } from "../provider";
import { Folder } from "@/openapi";
import { AxiosResponse } from "axios";
import { SelectedFileProvider } from "../components/provider";
import { Alert } from "flowbite-react";

interface ContentPageProps {
  params: {
    id: string;
  };
}

export default function ContentPage({ params: { id } }: ContentPageProps) {
  const isRoot = id === "home";

  const api = useContext(ProviderContext);
  const [folder, setFolder] = useState<Folder | null>(null);

  function apiFetchFolder(): Promise<AxiosResponse<Folder>> {
    return isRoot
      ? api.folder.folderControllerGetRootFolder()
      : api.folder.folderControllerGetFolder(id);
  }

  function fetchFolder() {
    apiFetchFolder()
      .then((response) => setFolder(response.data))
      .catch(console.error);
  }

  useEffect(() => {
    fetchFolder();
  }, [id]);

  return (
    <main className="h-screen">
      <AppNavbar />
      {folder && (
        <SelectedFileProvider>
          <div className="flex">
            <div className="hidden w-64 flex-none md:block">
              <AppSidebar />
            </div>
            <div className="w-64 grow gap-2 p-3">
              <Toolbar isRoot={isRoot} folderId={folder.id} onCreated={fetchFolder} />
              <AppBreadcrumb folder={folder} />
              { folder.share && (
                <div className="py-3">
                  <Alert color="info">
                    <span className="font-medium">
                      Cartella Attualmente in condivisione!
                    </span>
                  </Alert>
                </div>
              )}
              <ContentTable folder={folder} onAction={fetchFolder} />
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
