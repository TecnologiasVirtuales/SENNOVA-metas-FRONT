import { ModalidadModel } from "./modalidad.model";

export interface BilinguismoModel {
    bil_codigo:number;
    bil_version:number;
    modalidad:ModalidadModel;
    modalidad_id:number;
    bil_programa:string;
    bil_duracion:string;
}