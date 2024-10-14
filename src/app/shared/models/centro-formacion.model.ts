import { RegionalModel } from "./regional.model";

export interface CentroFormacionModel {
    id:number;
    nombre:string;
    codigo:string;
    regional_id:number;
    regional:RegionalModel;
}