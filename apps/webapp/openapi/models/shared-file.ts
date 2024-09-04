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

import { FileUserPermission } from './file-user-permission';
 /**
 * 
 *
 * @export
 * @interface SharedFile
 */
export interface SharedFile {

    /**
     * @type {string}
     * @memberof SharedFile
     */
    fileId: string;

    /**
     * @type {any}
     * @memberof SharedFile
     */
    file: any;

    /**
     * @type {Array<FileUserPermission>}
     * @memberof SharedFile
     */
    permissions: Array<FileUserPermission>;
}
