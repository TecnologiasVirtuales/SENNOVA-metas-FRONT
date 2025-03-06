import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-reporte-general-page',
  standalone: true,
  imports: [
    CommonModule,
    NzDatePickerModule,
    
  ],
  templateUrl: './reporte-general-page.component.html',
  styleUrl: './reporte-general-page.component.css'
})
export class ReporteGeneralPageComponent {

}
