import { useState } from "react";
import { ConnectedUser } from "../../lib/connectedUser";
import { Socket } from "socket.io-client";
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  ContentState,
  Editor,
  RawDraftContentState,
} from "draft-js";

import "./index.scss";
import "draft-js/dist/Draft.css";

type DocumentEditorProps = {
  uuid: string;
  initialRawContent: RawDraftContentState;
  users: ConnectedUser[];
  socket: Socket;
  isReadOnly: boolean;
};

type Cursor = {
  name: string;
  color: string;
};

const DocumentEditor = ({
  uuid,
  initialRawContent,
  users,
  socket,
  isReadOnly,
}: DocumentEditorProps) => {
  let initial;
  try {
    initial = convertFromRaw(initialRawContent);
  } catch (e) {
    initial = ContentState.createFromText("");
  }
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(initial),
  );
  const [borderColor, setBorderColor] = useState("");
  const me = users.find((u) => u.socketId == socket.id);

  socket.on("edit", ({ content, emitter }) => {
    setBorderColor(emitter.color);
    const value = convertFromRaw(content);
    const selection = editorState.getSelection();
    const state = EditorState.createWithContent(value);
    EditorState.forceSelection(state, selection);
    setEditorState(state);
  });

  const onChanges = (data: EditorState) => {
    setBorderColor(me!.color);
    const values = data.getCurrentContent();
    const raw = convertToRaw(values);
    console.log("broadcasting", raw);
    socket.emit("edit", raw);
    setEditorState(data);
  };

  return (
    <div>
      <div className="toolbar">{/* Render your toolbar components here */}</div>
      <div className="editor border-4 p-2" style={{ borderColor }}>
        <Editor
          editorState={editorState}
          onChange={onChanges}
          readOnly={isReadOnly}
        />
      </div>
    </div>
  );
};

export { DocumentEditor };
