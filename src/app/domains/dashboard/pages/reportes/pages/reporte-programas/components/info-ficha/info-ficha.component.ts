import { Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { P04FichaModel } from '@shared/models/p04.model';
import { UpperCasePipe } from '@shared/pipes/upper-case.pipe';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-info-ficha',
  standalone: true,
  imports: [
    NzModalModule,
    UpperCasePipe
  ],
  templateUrl: './info-ficha.component.html',
  styleUrl: './info-ficha.component.css'
})
export class InfoFichaComponent implements OnChanges{

  
  @Input() ficha?:P04FichaModel;

  @Output() close = new EventEmitter<void>();
  
  is_open:boolean = false;

  ngOnChanges(): void {
    this.is_open = !!this.ficha;
  }

  onClose(){
    this.is_open = false;
    this.close.emit();
  }

  onVisibleChange(visible: boolean): void {    
    if (!visible) {
      this.onClose();
    }
  }
}
