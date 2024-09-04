/* tslint:disable */
/* eslint-disable */
/**
 * Your API
 * API description
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { Folder } from './folder';
import { FolderUserPermission } from './folder-user-permission';
 /**
 * 
 *
 * @export
 * @interface SharedFolder
 */
export interface SharedFolder {

    /**
     * @type {Folder}
     * @memberof SharedFolder
     */
    folder: Folder;

    /**
     * @type {Array<FolderUserPermission>}
     * @memberof SharedFolder
     */
    permissions: Array<FolderUserPermission>;
}
