import { DepartamentoModel } from "./departamento.model";

export interface RegionalModel {
    codigo:number;
    nombre:string;
    slug:string;
    departamento_id:number;
    departamento:DepartamentoModel;
}