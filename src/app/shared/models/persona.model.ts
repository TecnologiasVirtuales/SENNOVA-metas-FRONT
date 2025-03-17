import { TipoDocumentoEnum } from "@shared/enum/tipo-documento.enum";
import { RoleModel } from "./role.model";

export interface PersonaModel {
    per_documento:number;
    email:string;
    per_tipo_documento:TipoDocumentoEnum;
    per_telefono:string;
    per_nombres:string;
    per_apellidos:string;
    is_superuser:boolean;
    is_staff:boolean;
    is_active:boolean;
    roles?:RoleModel[];
}
