import { User } from "@/openapi";

export interface ConnectedUser {
  user: User;
  socketId: string;

  color: string;
  pointer: number;
  selectedText: number;

  permission: "write" | "read";
}
