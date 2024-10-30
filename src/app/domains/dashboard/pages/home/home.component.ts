import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReportesService } from '@shared/services/reportes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{
  private reporte_service = inject(ReportesService);

  private dataSub:Subscription|null = null;

  ngOnInit(): void {
    this.dataSub = this.reporte_service.fichasByNivelModalidad()
      .subscribe({
        next:(data)=>{
          console.log(data);
        }
      })
  }

  ngOnDestroy(): void {
    this.dataSub!.unsubscribe();
  }
}
