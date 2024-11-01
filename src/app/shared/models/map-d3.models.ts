export interface MapDataModel {
    type:string;
    arcs:number[][];
    objects:MapObjectsModel;
    transform:MapTransformModel;
}

interface MapTransformModel {
    scale:number[];
    translate:number[];
}

interface MapObjectsModel{
    MGN_ANM_DPTOS:MGNDptos;
    MGN_ANM_MPIOS:MGNPios;
}

interface MGNDptos{
    type:string;
    geometries:DPtoGeometryModel[];
}

interface MGNPios{
    type:string;
    geometries:MPioGeometryModel[];
}

interface GeometryModel{
    type:string;
    arcs:number[];
    properties:DeptoPropertiesModel|MPioPropertiesModel
}

interface DPtoGeometryModel extends GeometryModel{
    properties:DeptoPropertiesModel;
}

interface MPioGeometryModel extends GeometryModel{
    properties:MPioPropertiesModel;
}

interface DeptoPropertiesModel {
    AREA:number;
    DPTO_CCDGO:string;
    DPTO_CNMBR:string;
    LATITUD:number;
    LONGITUD:number;
    STP27_PERS:number;
    TSP16_HOG:number;
    VERSION:number;
}

interface MPioPropertiesModel extends DeptoPropertiesModel{
    MPIO_CCDGO:string;
    MPIO_CDPMP:string;
    MPIO_CNMBR:string;
}