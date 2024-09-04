import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User, File, Folder, FileUserPermission, FolderUserPermission, SharedFolder, SharedFile } from "./entities";
import { ShareService, AuthService, FileService, UserService, FolderService, SharedService, SharedFileService } from "./service";
import { FolderController, FileController, ShareController, UserController, SharedController } from "./controller";
import { JwtStrategy } from "./strategy";
import { EditorGateway } from "./gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        entities: [User, Folder, File, FileUserPermission, FolderUserPermission, SharedFolder, SharedFile],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Folder,
      File,
      FileUserPermission,
      FolderUserPermission,
      SharedFolder,
      SharedFile,
    ]),
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

  ],
  providers: [
    UserService,
    JwtStrategy,
    AuthService,
    FileService,
    FolderService,
    ShareService,
    SharedService,
    SharedFileService,
    EditorGateway,
  ],
  controllers: [
    FolderController,
    FileController,
    ShareController,
    SharedController,
    UserController
  ],
})
export class AppModule {}
