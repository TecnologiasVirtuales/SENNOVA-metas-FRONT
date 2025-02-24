import { CentroFormacionModel } from "./centro-formacion.model";
import { MetaModel } from "./meta.model";
import { ModalidadModel } from "./modalidad.model";

export interface MetaFormacionModel {
    metd_id: number;
    meta_id: number;
    meta?:MetaModel;
    modalidad_id: number;
    modalidad?:ModalidadModel;
    centro_de_formacion_id: number;
    centro_de_formacion?: CentroFormacionModel;
    met_formacion_operario: number;
    met_formacion_auxiliar: number;
    met_formacion_tecnico: number;
    met_formacion_profundizacion_tecnica: number;
    met_formacion_tecnologo: number;
    met_formacion_evento: number;
    met_formacion_curso_especial: number;
    met_formacion_bilinguismo: number;
    met_formacion_sin_bilinguismo: number;
}