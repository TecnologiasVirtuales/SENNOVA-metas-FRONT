import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MapParamsDataModel, MapParamsModel } from '@shared/models/map-d3-params.models';
import { MapDataModel } from '@shared/models/map-d3.models';
import * as d3 from 'd3';
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

  private land?:any;
  private map3:any;

  ngOnInit(): void {
    this.loadMapData();
  }

  loadMapData(): void {
    d3.json<Topology>('/json/mapData.json')
      .then((data)=>{
        this.land = data;
        let algo = topojson.feature(data!,{
          type:'GeometryCollection',
          geometries:data!.objects.MGN_ANM_MPIOS.geometries
        });
        console.log('topojson',algo);
        this.initializeMap("19")
      });
  }

  initializeMap(dpto_id:string){
    if(!this.land) return;
    const {objects} = this.land
    const {MGN_ANM_MPIOS} = objects;
    const {geometries} = MGN_ANM_MPIOS;
    this.drawMap({
      data:geometries
        .filter((g)=>g.properties.DPTO_CCDGO===dpto_id)
        .map((g)=>{
          return {
            id:g.properties.MPIO_CCDGO,
            value:g.properties.AREA
          }
        }),
      id:(d:MapParamsDataModel)=>d.id,
      draw_cities:true
    });
  }

  drawMap(map_data:MapParamsModel){
    let {color,r,draw_cities} = map_data!;
    // if(!r) r = d3.scaleSqrt().domain([0,d3.max()])
    color = color || d3.scaleSequential(d3.interpolateReds);
  }

}
