export interface MapDataModel {
    type:string;
    arcs:number[][];
    objects:MapObjectsModel;
    transform:MapTransformModel;
}

export interface MapTransformModel {
    scale:number[];
    translate:number[];
}

export interface MapObjectsModel{
    MGN_ANM_DPTOS:MGNDptos;
    MGN_ANM_MPIOS:MGNPios;
}

export interface MGNDptos{
    type:string;
    geometries:DPtoGeometryModel[];
}

export interface MGNPios{
    type:string;
    geometries:MPioGeometryModel[];
}

export interface GeometryModel{
    type:string;
    arcs:number[];
    properties:MPioPropertiesModel|DptoPropertiesModel
}

export interface DPtoGeometryModel extends GeometryModel{
    properties:DptoPropertiesModel;
}

export interface MPioGeometryModel extends GeometryModel{
    properties:MPioPropertiesModel;
}

export interface DptoPropertiesModel {
    AREA:number;
    DPTO_CCDGO:string;
    DPTO_CNMBR:string;
    LATITUD:number;
    LONGITUD:number;
    STP27_PERS:number;
    TSP16_HOG:number;
    VERSION:number;
}

export interface MPioPropertiesModel extends DptoPropertiesModel{
    MPIO_CCDGO:string;
    MPIO_CDPMP:string;
    MPIO_CNMBR:string;
}