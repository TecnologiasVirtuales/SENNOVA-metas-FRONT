export interface RoleModel {
    rol_id:number;
    rol_nombre:string;
}

export interface RolePersonaModel{
    rolp_id:number;
    rolp_fecha_inicio:Date;
    rolp_fecha_fin?:Date;
    rolp_estado:boolean;
    persona_id:number;
    rol:RoleModel;
    rol_id:number;
}