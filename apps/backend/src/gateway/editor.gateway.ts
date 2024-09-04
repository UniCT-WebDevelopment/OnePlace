import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { OnGatewayInit } from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtStrategy } from "src/strategy";
import { JwtService } from "@nestjs/jwt";
import { ConnectedUser, FileEditingSession } from "src/model";
import { SharedFileService } from "src/service";
import { File } from "src/entities";
import { readFileSync, readSync } from "fs";

@WebSocketGateway({ namespace: '/editor', cors: { origin: '*' } })
export class EditorGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    constructor(
        private jwtService: JwtService,
        private jwtStategy: JwtStrategy,
        private sharedFileService: SharedFileService,
    ) {}

    sessions: FileEditingSession[] = [];
    
    getOrCreate(file: File): FileEditingSession {
        const session = this.sessions.find(session => session.file.id == file.id)
        if (session == null) {
            const content = readFileSync(`data/${file.id}`, { encoding: 'utf-8' });
            const session = { file, users: [], content };
            this.sessions.push(session);
            return session;
        }
        return session;
    }
    
    @WebSocketServer()
    server: Server;
    
    afterInit(server: Server) {
        console.log('Init', server.engine);
    }
    
    @UseGuards(AuthGuard('jwt'))
    async handleConnection(client: any, request: any): Promise<void> {
        try {
            const socketId = client.id;
            const token = client.handshake.auth.token;
            const fileId = client.handshake.query.uuid;
            const payload = this.jwtService.decode(token);
            const user = await this.jwtStategy.validate(payload);
            const { permission, file } = await this.sharedFileService.get(user, fileId);
            const session = this.getOrCreate(file);
            const color = '#' + Math.floor(Math.random()*16777215).toString(16);
            const connectedUser: ConnectedUser = { user, permission, pointer: 0, selectedText: 0, socketId, color };
            session.users.push(connectedUser);
            for (const user of session.users)
                this.server.to(user.socketId).emit('user_connected', session);
        } catch(error) {
            console.error(error)
            client.disconnect();
        }
    }

    handleDisconnect(client: any): void {
        const socketId = client.id;
        const { uuid } = client.handshake.query;
        const session = this.sessions.find(session => session.file.id === uuid);
        const filtered = session.users.filter(user => user.socketId !== socketId);
        session.users = filtered;
        for (const user of session.users)
            this.server.to(user.socketId).emit('user_connected', session);
    }

    @SubscribeMessage('edit')
    edit(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): FileEditingSession {
        const socketId = client.id;
        const { uuid } = client.handshake.query;
        const session = this.sessions.find(session => session.file.id === uuid);
        session.content = data;
        const emitter = session.users.find(u => u.socketId == client.id)
        for (const user of session.users)
            if (user.socketId != client.id)
                this.server.to(user.socketId).emit('edit', { content: session.content, emitter});
        return session;
    }
}
