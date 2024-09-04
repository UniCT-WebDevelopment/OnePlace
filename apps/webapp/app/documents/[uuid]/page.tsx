"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import { DocumentEditor, Header } from "./components";
import { ConnectedUser } from "./lib/connectedUser";

interface DocumentPageProps {
  params: {
    uuid: string;
  };
}

export default function DocumentPage({ params: { uuid } }: DocumentPageProps) {
  const server = process.env.NEXT_PUBLIC_API_URL;
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState();
  const [socket, setSocket] = useState<Socket | null>(null);

  const onConnectedUsers = (data: any) => {
    console.log("from connected_useres", data);
    setTitle(data.file.name);
    setContent(data.content);
    setConnectedUsers(data.users);
  };
  const onEvent = (data: any) => console.log("event", data);

  async function initSocket() {
    console.log("init socket");
    const token = await getAccessTokenSilently();
    const socket = io(`${server}/editor`, {
      reconnectionAttempts: 3,
      auth: { token },
      query: { uuid },
      autoConnect: false,
    });

    socket.on("user_connected", onConnectedUsers);
    socket.on("disconnect", onEvent);

    setSocket(socket);
    socket.connect();
  }

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    initSocket();
  }, []);

  if (!socket) return <div>Connecting...</div>;
  if (!content) return <div>Loading...</div>;

  const me = connectedUsers.find((u) => u.socketId == socket.id);

  if (me == null) return <div>Invalid me State</div>;
  const isReadOnly = me?.permission == "read";

  return (
    <main className="h-screen">
      <Header
        title={title}
        connectedUsers={connectedUsers}
        isReadOnly={isReadOnly}
        socket={socket}
      />
      <DocumentEditor
        uuid={uuid}
        initialRawContent={content}
        users={connectedUsers}
        socket={socket}
        isReadOnly={isReadOnly}
      />
    </main>
  );
}
