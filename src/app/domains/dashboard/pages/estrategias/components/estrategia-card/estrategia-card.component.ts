import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstrategiaModel } from '@shared/models/estrategia.model';
import { UpperCasePipe } from '@shared/pipes/upper-case.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { EstrategiaActionsComponent } from '../estrategia-actions/estrategia-actions.component';

@Component({
  selector: 'app-estrategia-card',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    UpperCasePipe,
    EstrategiaActionsComponent
  ],
  templateUrl: './estrategia-card.component.html',
  styleUrl: './estrategia-card.component.css'
})
export class EstrategiaCardComponent {
  @Input({required:true}) estrategia:EstrategiaModel = {} as EstrategiaModel;
  @Input() seleccionada?:string;


  @Output() onSelect:EventEmitter<EstrategiaModel> = new EventEmitter();

  selectEstrategia(){
    this.onSelect.emit(this.estrategia);
  }
}
