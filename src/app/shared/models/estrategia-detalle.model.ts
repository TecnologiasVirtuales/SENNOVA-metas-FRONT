import { EstrategiaModel } from "./estrategia.model";
import { MetaFormacionModel } from "./meta-formacion.model";
import { MetaModel } from "./meta.model";
import { ModalidadModel } from "./modalidad.model";

export interface EstrategiaDetalleModel {
    estd_id:number;
    estrategia_id:number;
    estrategia?:EstrategiaModel;
    meta_formacion_id:number;
    meta_formacion?:MetaFormacionModel;
    estd_operario_meta:number;
    estd_auxiliar_meta:number;
    estd_tecnico_meta:number;
    estd_profundizacion_tecnica_meta:number;
    estd_tecnologo:number;
    estd_evento:number;
    estd_curso_especial:number;
    estd_bilinguismo:number;
    estd_sin_bilinguismo:number;
}