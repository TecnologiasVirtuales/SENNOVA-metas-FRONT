import { 
  Component, OnInit, ElementRef, ViewChild, inject, OnDestroy, 
  Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterViewInit 
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection, Geometry } from 'geojson';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-colombia-map',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent
  ],
  templateUrl: './colombia-map.component.html',
  styleUrl: './colombia-map.component.css',
  viewProviders: [provideIcons({ lucideX })]
})
export class ColombiaMapComponent implements OnDestroy, OnInit, OnChanges, AfterViewInit {

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  // Esta propiedad puede venir del padre o actualizarse internamente.
  @Input() selected_municipio?: string;
  @Input() selected_departamento?:string;

  @Output() nombre_departamento = new EventEmitter<string>();
  @Output() nombre_municipio = new EventEmitter<string>();
  @Output() mostrar_pais = new EventEmitter<void>();

  private http = inject(HttpClient);
  private map_sub?: Subscription;
  private resizeObserver: ResizeObserver | null = null;

  private mapData: any;
  departamentos: any;
  municipios: any;

  // Variables para mantener la "vista" actual y poder re-renderizar al cambiar el tamaño
  private currentFeatures: any = null;
  private currentSize: number = 7500;
  private currentCenter: [number, number] | undefined = undefined;

  // Valores iniciales (se actualizarán según el contenedor)
  width = 640;
  height = 750;

  ngOnInit(): void {
    this.loadMapData();
  }

  ngAfterViewInit(): void {
    // Se crea un observador para detectar cambios en el tamaño del contenedor
    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Si ya se ha renderizado alguna vez, re-renderizamos con las mismas características
        if (this.currentFeatures) {
          this.renderMap(this.currentFeatures, this.currentSize, this.currentCenter);
        }
      }
    });
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Asegurarse de que la información de los departamentos ya esté cargada
    if (this.departamentos) {
      // Si cambia el departamento seleccionado
      if (changes['selected_departamento'] && this.selected_departamento) {
        // Buscar el feature que corresponda al departamento seleccionado
        const deptFeature = this.departamentos.features.find((d: any) =>
          d.properties.DPTO_CNMBR === this.selected_departamento
        );
        if (deptFeature) {
          // Renderiza el departamento: se filtran sus municipios y se centra la proyección
          this.mostrarDepartamento(deptFeature);
        } else {
          // Opcional: si no se encuentra el departamento, se puede mostrar el mapa completo
          this.mostrarPais();
        }
      }
      // Si cambia el municipio seleccionado, actualiza los colores
      if (changes['selected_municipio'] && this.selected_municipio) {
        this.updateMapColors();
      }
    }
  }
  

  ngOnDestroy(): void {
    this.resetMapSub();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private loadMapData() {
    this.map_sub = this.http.get('assets/mapData.json')
      .subscribe({
        next: (data: any) => {
          this.mapData = data;
          const { objects } = data;
          const { MGN_ANM_DPTOS } = objects;
          if (!data || !objects || !MGN_ANM_DPTOS) {
            console.error("Datos de TopoJSON incorrectos:", data);
            return;
          }
          this.departamentos = topojson.feature(
            this.mapData,
            this.mapData.objects.MGN_ANM_DPTOS
          ) as unknown as FeatureCollection<Geometry>;

          this.municipios = topojson.feature(
            this.mapData,
            this.mapData.objects.MGN_ANM_MPIOS
          ) as unknown as FeatureCollection<Geometry>;

          if (this.departamentos.features) {
            // Guarda los parámetros de renderización para poder re-dibujar al cambiar el tamaño.
            this.currentFeatures = this.departamentos.features;
            this.currentCenter = undefined;
            this.renderMap(this.currentFeatures, this.currentSize/5);
          }
        }
      });
  }

  private renderMap(featuresData: any, size: number, center?: [number, number]) {
    // Guarda los parámetros actuales para re-renderizar en caso de resize.
    this.currentFeatures = featuresData;
    this.currentCenter = center;

    // Elimina el SVG y tooltip previos.
    d3.select(this.mapContainer.nativeElement).select('svg').remove();
    d3.select('#tooltip').remove();

    // Se obtiene el tamaño actual del contenedor
    const container = this.mapContainer.nativeElement.getBoundingClientRect();
    this.width = container.width;
    this.height = container.height;
    const projectionCenter = center || [-74, 4];

    // Se usa un SVG responsivo: width y height en 100% y viewBox con las dimensiones actuales.
    const svg = d3.select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('margin', 'auto');

    const projection = d3.geoMercator()
      .scale(size)
      .center(projectionCenter)
      .translate([this.width / 2, this.height / 2]);

    const path = d3.geoPath().projection(projection);

    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    svg.append('g')
      .selectAll('path')
      .data(featuresData)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => this.getFillColor(d))
      .attr('stroke', 'var(--primary-green-color)')
      .attr('stroke-width', 1)
      .on('click', (event, d: any) => {
        if (d.properties && d.properties.MPIO_CNMBR) {
          // Actualiza la selección y emite el valor.
          this.selected_municipio = d.properties.MPIO_CNMBR;
          this.nombre_municipio.emit(this.selected_municipio);
        } else if (d.properties && d.properties.DPTO_CNMBR) {
          this.nombre_departamento.emit(d.properties.DPTO_CNMBR);
          if (d.properties.DPTO_CNMBR === 'BOGOTÁ, D.C.') {
            this.nombre_municipio.emit(this.selected_municipio);
          }
        }
        // Actualiza los colores inmediatamente.
        svg.selectAll('path')
          .attr('fill', (d2: any) => this.getFillColor(d2));

        // Si se hizo click en un departamento, muestra sus municipios.
        if (d.properties && d.properties.DPTO_CNMBR) {
          this.mostrarDepartamento(d);
        }
      })
      .on('mouseover', (event, d: any) => {
        tooltip.style('visibility', 'visible')
          .text(d.properties?.DPTO_CNMBR ? d.properties.DPTO_CNMBR : d.properties.MPIO_CNMBR);
        if (!(this.selected_municipio && d.properties.MPIO_CNMBR === this.selected_municipio)) {
          d3.select(event.target)
            .attr('fill', 'var(--secondary-green-color)');
        }
      })
      .on('mousemove', (event) => {
        tooltip.style('top', (event.pageY - 20) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', (event, d: any) => {
        tooltip.style('visibility', 'hidden');
        d3.select(event.target)
          .attr('fill', this.getFillColor(d));
      });
  }

  private getFillColor(d: any): string {
    return (this.selected_municipio && d.properties.MPIO_CNMBR === this.selected_municipio)
      ? 'var(--primary-green-color)'
      : 'var(--primary-white-color)';
  }

  private mostrarDepartamento(departamento: any) {
    const center = d3.geoCentroid(departamento);
    const newSize = this.currentSize;
    const filteredMunicipios = this.municipios.features.filter(
      (municipio: any) => municipio.properties.DPTO_CCDGO === departamento.properties.DPTO_CCDGO
    );
    this.renderMap(filteredMunicipios, newSize/1.425, center);
  }

  mostrarPais() {
    this.mostrar_pais.emit();
    this.renderMap(this.departamentos.features,this.currentSize/5);
  }

  private resetMapSub() {
    if (this.map_sub) {
      this.map_sub.unsubscribe();
    }
  }

  private updateMapColors() {
    d3.select(this.mapContainer.nativeElement)
      .selectAll('path')
      .attr('fill', (d: any) => this.getFillColor(d));
  }
}
