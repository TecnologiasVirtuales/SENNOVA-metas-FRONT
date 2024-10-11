import { TipoDocumentoEnum } from "@shared/enum/tipo-documento.enum";

export interface RegisterDto{
    documento:number;
    email:string;
    tipo_documento:TipoDocumentoEnum;
    nombre:string;
    segundo_nombre?:string;
    apellido:string;
    segundo_apellido?:string;
    foto_perfil?:File;
}