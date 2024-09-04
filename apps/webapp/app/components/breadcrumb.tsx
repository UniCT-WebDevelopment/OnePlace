"use client";

import { Folder } from "@/openapi";
import { Breadcrumb } from "flowbite-react";

interface AppBreadcrumbProps {
  folder: Folder;
}

export function AppBreadcrumb({ folder }: AppBreadcrumbProps) {
  const f: Folder[] = [];
  let v: Folder = folder;
  while (v.parent) {
    f.push(v);
    v = v.parent;
  }
  return (
    <Breadcrumb
      aria-label="Solid background breadcrumb example"
      className="bg-gray-50 px-5 py-3 dark:bg-gray-800"
    >
      <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
      {f.reverse().map((folder) => (
        <Breadcrumb.Item key={"breadcrumb-" + folder.id} href={`/${folder.id}`}>
          {folder.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
