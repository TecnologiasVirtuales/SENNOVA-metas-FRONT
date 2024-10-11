import { TipoDocumentoEnum } from "@shared/enum/tipo-documento.enum";
import { RoleModel } from "./role.model";

export interface UsuarioModel {
    documento:number;
    email:string;
    tipo_documento:TipoDocumentoEnum;
    nombre:string;
    segundo_nombre:string;
    apellido:string;
    segundo_apellido:string;
    foto_perfil:string;
    is_superurser:boolean;
    is_staff:boolean;
    is_active:boolean;
    roles?:RoleModel[];
}
