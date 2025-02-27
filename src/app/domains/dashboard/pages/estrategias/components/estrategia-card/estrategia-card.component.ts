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
  @Input({required:true}) index:number = 0;

  @Output() onSelect:EventEmitter<EstrategiaModel> = new EventEmitter();
  @Output() update:EventEmitter<{estrategia:EstrategiaModel,index:number}> = new EventEmitter();
  @Output() delete:EventEmitter<number> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  selectEstrategia(){
    this.onSelect.emit(this.estrategia);
  }

  onDelete(index:number){
    this.delete.emit(index);
  }

  onUpdate(data:{estrategia:EstrategiaModel,index:number}){
    this.update.emit(data);
  }

  onLoading(state:boolean){
    this.setLoading.emit(state);
  }
}
