export interface DF14RegionalModel {
    codigo_regional:number;
    regional:string;
}

export interface DF14CentroFormacionModel{
    codigo_sede:number;
    sede:string;
}

export interface DF14NivelFormacionModel{
    nivel_de_formacion:string;
}

export interface DF14EstadoAprendizModel{
    estado_aprendiz:string;
}

export interface DF14ProgramaModel{
    codigo_programa:number;
    programa:string;
    version_prograna:number;
    nivel_de_formacion:string;
}

export interface DF14TipoDocumentoModel{
    tipo_documento:string;
    descripcion:string;
}