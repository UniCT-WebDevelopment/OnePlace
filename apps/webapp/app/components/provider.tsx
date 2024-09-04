import React, { createContext, useState } from "react";
import { ModelFile } from "@/openapi";

export const SelectedFileContext = createContext<{
  selectedFile: ModelFile | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<ModelFile | null>>;
  deselectFile: () => void;
}>({
  selectedFile: null,
  setSelectedFile: () => {},
  deselectFile: () => {},
});

export const SelectedFileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFile, setSelectedFile] = useState<ModelFile | null>(null);
  const deselectFile = () => setSelectedFile(null);

  return (
    <SelectedFileContext.Provider
      value={{ selectedFile, setSelectedFile, deselectFile }}
    >
      {children}
    </SelectedFileContext.Provider>
  );
};
