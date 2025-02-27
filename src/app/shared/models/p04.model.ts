export interface P04FichaModel {
  identificador_ficha:number;
  estado_curso:string;
  nivel_formacion:string;
  fecha_inicio_ficha:Date;
  fecha_terminacion_ficha:Date;
  nombre_jornada:string;
  nombre_regional:string;
  nombre_programa_formacion:string;
  nombre_departamento_curso:string;
  nombre_municipio_curso:string;
  nombre_centro:string;
}

export interface P04DesercionesModel {
  total:number;
  desertados:number;
  activos:number;
}

export interface P04ModalidadModel {
    modalidad_formacion:string;
}

export interface P04CentroFormacionModel {
  nombre_centro: string;
}

export interface P04RegionalModel {
  nombre_regional: string;
}

export interface P04MunicipioModel {
  nombre_municipio_curso: string;
}

export interface P04JornadaModel {
  nombre_jornada: string;
}

export interface P04ProgramaModel {
  codigo_programa: number;
  version_programa: string;
  nombre_programa_formacion: string;
}

export interface P04NivelModel{
  nivel_formacion:string;
}