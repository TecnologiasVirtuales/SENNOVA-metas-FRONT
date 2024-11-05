import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MapParamsDataModel, MapParamsModel } from '@shared/models/map-d3-params.models';
import { DPtoGeometryModel, MapDataModel, MPioGeometryModel, MPioPropertiesModel } from '@shared/models/map-d3.models';
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
  @ViewChild('mapContainer') private map_container?:ElementRef;

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
        // this.land = data;
        this.land = topojson.feature(data!, MGN_ANM_MPIOS) as FeatureCollection<Geometry, GeoJsonProperties>;
        console.log(this.land);
        
        // console.log('topojson',algo);
        this.initializeMap(dpto_id)
      });
  }

  initializeMap(dpto_id:string){
    if(!this.land) return;
    const {features} = this.land;
    // console.log(features[0].properties);
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
    console.log(filtrados);
    
    this.drawMap({
      data:filtrados,
      id:(d:MapParamsDataModel)=>d.id,
      draw_cities:true
    });
  }

  drawMap(map_data: MapParamsModel) {
    let {
      color,
      r,
      draw_cities = true,
      r_by_population = true,
      draw_map = true,
      draw_deps = true,
      alpha_map = 0.3,
      stroke_map = "#aaa",
      stroke_map_depts = "#333",
      stroke_nodes = "#eee",
      r_range = [1, 20],
      width = this.width,
      height = this.height,
      fill_map = null,
      background_color = null,
      label_color = "#000",
      label_font = "9px sans-serif",
      label_align = "center",
      label_if_bigger_than = 10,
      force_to_center_id = 0.1,
      collide = true,
      collide_margin = 1,
      warmup = 200,
      cod_departamento,
      value = (d: MPioGeometryModel) => d.properties.MPIO_CCDGO,
    } = map_data;
  
    // Set up color and radius scaling
    color = color || d3.scaleSequential(d3.interpolateReds);
    if (!r) {
      r = d3.scaleSqrt()
        .domain([0, d3.max(this.land!.features, (d:MPioPropertiesModel) => d.properties!.STP27_PERS)])
        .range(r_range);
    }
  
    // Filter department if specified
    const filteredData = cod_departamento
      ? this.land?.features.filter((d) => d.properties?.DPTO_CCDGO == cod_departamento)
      : this.land?.features;
  
    // Set up projection and path
    const projection = d3.geoTransverseMercator()
      .rotate([74 + 30 / 60, -38 - 50 / 60])
      .fitExtent(
        [
          [10, 10],
          [width - 10, height - 10]
        ],
        cod_departamento ? { type: "FeatureCollection", features: filteredData } : this.land
      );
  
    const path = d3.geoPath().projection(projection);
  
    // Draw the map if required
    const context = d3.select(this.map_container?.nativeElement)
      .append('canvas')
      .attr('width', width)
      .attr('height', height)
      .node()
      ?.getContext('2d');
  
    if (context && draw_map) {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = stroke_map;
      context.globalAlpha = alpha_map;
      if (fill_map) {
        context.fillStyle = fill_map;
        context.fill(path(filteredData));
      }
      context.stroke(path(filteredData));
    }
  
    // Draw nodes
    const nodes = (draw_cities ? filteredData : this.land.features).map(d => ({ ...d }));
    nodes.forEach((n) => {
      n.centroid = path.centroid(n);
      n.x = n.centroid[0];
      n.y = n.centroid[1];
      n.r = r_by_population ? r(n.properties?.STP27_PERS) : r(value(n));
    });
  
    // Initialize forces
    const simulation = d3.forceSimulation(nodes)
      .force('x', d3.forceX(d => d.x).strength(force_to_centroid))
      .force('y', d3.forceY(d => d.y).strength(force_to_centroid))
      .force('collide', d3.forceCollide((d) => d.r + collide_margin).iterations(1))
      .stop();
  
    for (let i = 0; i < warmup; i++) simulation.tick();
  
    // Draw each node
    context.save();
    nodes.forEach((n) => {
      context.beginPath();
      context.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
      context.strokeStyle = stroke_nodes;
      context.fillStyle = color(value(n));
      context.lineWidth = 1;
      context.stroke();
      context.fill();
    });
    context.restore();
  
    // Add labels
    context.fillStyle = label_color;
    context.font = label_font;
    context.textAlign = label_align;
    nodes.forEach((n) => {
      if (n.r > label_if_bigger_than) {
        context.fillText(n.properties?.MPIO_CNMBR || "", n.x, n.y);
      }
    });
  }

}
