import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-modalidad-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule
  ],
  templateUrl: './modalidad-actions.component.html',
  styleUrl: './modalidad-actions.component.css'
})
export class ModalidadActionsComponent {

}
