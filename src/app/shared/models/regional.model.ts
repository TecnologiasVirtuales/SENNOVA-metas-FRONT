import { DepartamentoModel } from "./departamento.model";

export interface RegionalModel {
    id:number;
    nombre:string;
    codigo:string;
    departamento_id:number;
    departamento:DepartamentoModel;
}