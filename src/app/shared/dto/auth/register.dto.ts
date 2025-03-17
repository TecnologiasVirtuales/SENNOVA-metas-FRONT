import { TipoDocumentoEnum } from "@shared/enum/tipo-documento.enum";

export interface RegisterDto{
    per_documento:number;
    email:string;
    per_tipo_documento:TipoDocumentoEnum;
    password?:string;
    password2?:string;
    per_nombres:string;
    per_apellidos:string;
    per_telefono:string;
}