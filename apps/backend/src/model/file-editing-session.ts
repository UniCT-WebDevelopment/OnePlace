import { ConnectedUser } from "./conntected-users";
import { File } from "src/entities";

export class FileEditingSession {
    // Opened File
    file: File;

    // Connected Users
    users: ConnectedUser[];

    content: string;
}