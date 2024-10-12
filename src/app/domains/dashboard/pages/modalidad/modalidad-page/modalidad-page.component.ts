import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ModalidadActionsComponent } from "../components/modalidad-actions/modalidad-actions.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroAcademicCapSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-modalidad-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFlexModule,
    NzGridModule,
    ModalidadActionsComponent,
    NgIconComponent
],
  templateUrl: './modalidad-page.component.html',
  styleUrl: './modalidad-page.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid
  })]
})
export class ModalidadPageComponent {

}
