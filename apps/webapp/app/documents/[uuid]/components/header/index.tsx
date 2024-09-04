"user client";

import { User } from "@/openapi";
import React from "react";
import { Socket } from "socket.io-client";

type ConnectedUser = {
  permission: "write" | "read";
  pointer: number;
  selectedText: number;
  socketId: string;
  color: string;
  user: User;
};

type HeaderProps = {
  title: string;
  socket: Socket;
  connectedUsers: ConnectedUser[];
  isReadOnly: boolean;
};

const Header: React.FC<HeaderProps> = ({
  title,
  connectedUsers,
  isReadOnly,
}) => {
  const handlePermissionChange = (userId: string, newPermission: string) => {};

  return (
    <header>
      <nav className="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {title}
            </span>
            {isReadOnly && (
              <span className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Sola Lettura
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 lg:order-2">
            <span className="text-sm font-medium dark:text-gray-300">
              Connessi: {connectedUsers.length}
            </span>
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {connectedUsers.map(({ user, color }) => (
                <img
                  key={"permission-usr-" + Math.random()}
                  className={`h-10 w-10 rounded-full border-2 border-white p-0.5 dark:border-gray-800`}
                  style={{ backgroundColor: color }}
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export { Header };
