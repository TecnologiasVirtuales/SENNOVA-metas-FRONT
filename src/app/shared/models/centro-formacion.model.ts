import { RegionalModel } from "./regional.model";

export interface CentroFormacionModel {
    codigo:number;
    nombre:string;
    slug:string;
    regional_id:number;
    regional:RegionalModel;
}