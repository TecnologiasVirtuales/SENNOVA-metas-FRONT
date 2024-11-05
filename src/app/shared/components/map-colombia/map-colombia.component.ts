import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MapParamsDataModel, MapParamsModel } from '@shared/models/map-d3-params.models';
import { DptoPropertiesModel, DPtoGeometryModel, MapDataModel, MPioGeometryModel, MPioPropertiesModel } from '@shared/models/map-d3.models';
import * as d3 from 'd3';
import { FeatureCollection, GeoJsonProperties, Geometry, GeometryCollection } from 'geojson';
import * as topojson from 'topojson-client';
import {Topology} from 'topojson-specification';

@Component({
  selector: 'app-map-colombia',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './map-colombia.component.html',
  styleUrl: './map-colombia.component.css'
})
export class MapColombiaComponent implements OnInit{
  @ViewChild('mapContainer') private map_container:ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild('context') private context:ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;

  private width = 800;
  private height = 600;

  private land?:FeatureCollection<Geometry,GeoJsonProperties>;
  private map3:any;

  ngOnInit(): void {
    this.loadMapData("19");
  }

  loadMapData(dpto_id:string): void {
    d3.json<Topology>('/json/mapData.json')
      .then((data)=>{
        const {objects} = data!;
        const {MGN_ANM_MPIOS} = objects;
        this.land = topojson.feature(data!, MGN_ANM_MPIOS) as FeatureCollection<Geometry, GeoJsonProperties>;   
        this.initializeMap(dpto_id)
      });
  }

  initializeMap(dpto_id:string){
    if(!this.land) return;
    const {features} = this.land;
    let filtrados = features.filter((f)=>{
      const {properties} = f;
      const {DPTO_CCDGO} = properties as MPioPropertiesModel;
      return DPTO_CCDGO === dpto_id;
    }).map((f)=>{
      const {properties} = f;
      const {MPIO_CCDGO,AREA} = properties as MPioPropertiesModel;
      return {
        id:MPIO_CCDGO,
        value:AREA
      }
    });    
    this.drawMap({});
  }

  drawMap(map_data: MapParamsModel) {
    let {
      data = null,
      id = (d)=>d.id,
      cod_departamento=null,
      draw_cities=true,
      draw_deps=true,
      idFeatures = (d:MPioGeometryModel|DPtoGeometryModel) => {
        if(draw_cities){
          d = d as MPioGeometryModel;
          const {properties} = d;
          let mpio_properties = properties as MPioPropertiesModel;
          return mpio_properties.MPIO_CDPMP;
        }else{
          d = d as DPtoGeometryModel;
          const {properties} = d;
          let dpto_properties = properties as DptoPropertiesModel;
          return dpto_properties.DPTO_CNMBR;
        }
      },
      value = (d:MPioGeometryModel|DPtoGeometryModel) =>d.properties.DPTO_CCDGO,
      color,
      fill = null,
      projection,
      draw_map = true,
      fill_map = null,
      stroke_map = "#000",
      stroke_map_depts = "#333",
      stroke_nodes = "#eee",
      stroke_width_nodes = 1,
      alpha_nodes = 1,
      alpha_map = 0.3,
      width = 600,
      height = 600,
      container = this.map_container,
      context = this.context,
      context_map = this.context,
      margin = {left:10,top:10,rigth:10,bottom:10},
      r_range = [1,20],
      r_by_population = true,
      r = d3.scaleSqrt()
        .domain([
          0,
          d3.max(this.land!.features, (d) => {
            const { properties } = d;
            const { STP27_PERS } = properties!;
            return STP27_PERS;
          })
        ]).range(r_range),
      force_to_center_id = 0.1,
      collide = true,
      collide_margin = 1,
      warmup = 200,
      label_color = "#000",
      label_font = "9px sans-serif",
      label_align = "center",
      label_if_bigger_than = 10,
      parent_invalidation,
      background_color = "#f0f0f0",
      drag = false,
      ftm_val = d3.format('.2s')
    } = map_data;

    color = color || d3.scaleSequential(d3.interpolateReds)
    
    r.range(r_range);

    // if(!r_by_population){
    //   r.domain(d3.extent(data!,value!));
    // }
    

  }

}
