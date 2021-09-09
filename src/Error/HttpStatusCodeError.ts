import { HttpStatusCode } from "../Output/HttpStatusCode";

export class HttpStatusCodeError extends Error {
    meta: { [key: string ]: any };  
    code: HttpStatusCode;
    
    constructor(message: string, statusCode: HttpStatusCode, meta?: { [key: string ]: any }) {
        super(message);
        this.code = statusCode;
        this.meta = meta;
    }
}