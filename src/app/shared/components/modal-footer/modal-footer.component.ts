import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-modal-footer',
  standalone: true,
  imports: [
    CommonModule,
    NzFlexModule,
    NzButtonModule
  ],
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.css'
})
export class ModalFooterComponent {

  @Input() saveDisabled:boolean = false;
  @Input() loading:boolean = false;
  @Input() type:'alert'|'save' = 'save';

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.save.emit();
  }

  onOk(){
    this.ok.emit();
  }
}
