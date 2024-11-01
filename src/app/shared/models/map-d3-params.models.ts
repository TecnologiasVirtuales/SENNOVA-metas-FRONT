import { ScaleSequential } from "d3";
import { MapDataModel } from "./map-d3.models";

export interface MapParamsModel{
    data?:MapParamsDataModel[];
    id?:(d:MapParamsDataModel)=>string;
    cod_departamento?:string;
    draw_cities?:boolean;
    draw_deps?:boolean;
    idFeatures?:(d:MapDataModel)=>string;
    value?:(d:MapDataModel)=>string;
    color?:ScaleSequential<string,never>;
    fill?:any;
    projection?:any;
    draw_map?:boolean;
    fill_map?:boolean;
    stroke_map?:string;
    stroke_map_depts?:string;
    stroke_nodes?:string;
    stroke_width_nodes?:number;
    alpha_nodes?:number;
    alpha_map?:number;
    width?:number;
    height?:number;
    container?:any;
    context?:any;
    context_map?:any;
    margin?:MapMarginModel;
    r_range?:number[];
    r_by_population?:boolean;
    r?:number[];
    force_to_center_id?:number;
    collide?:boolean;
    collide_margin?:number;
    warmup?:number;
    label_color?:string;
    label_font?:string;
    label_align?:string;
    label_if_bigger_than?:number;
    parent_invalidation?:any;
    background_color?:string;
    drag?:boolean;
    ftm_val?:any;
}

export interface MapParamsDataModel{
    id:string;
    value:number;
}

interface MapMarginModel{
    left:number;
    top:number;
    rigth:number;
    bottom:number;
}