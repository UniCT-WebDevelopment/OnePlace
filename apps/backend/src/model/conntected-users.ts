import { User } from "src/entities";
import { Permission } from "src/enum";

export class ConnectedUser {
    // Connected User Reference
    user: User;

    socketId: string;

    color: string;
    
    // numer of caracter where pointer is potioned
    pointer: number;

    // number of caracter selected from where pointer is placed
    selectedText: number;

    // Permission
    permission: Permission;
}