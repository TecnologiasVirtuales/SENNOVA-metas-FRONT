import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus, lucideTrash, lucideX } from '@ng-icons/lucide';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { PersonaModel } from '@shared/models/persona.model';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuario-actions',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    ModalFooterComponent,
    NzAlertModule,
    NgIconComponent,
    NzSwitchModule
  ],
  templateUrl: './usuario-actions.component.html',
  styleUrl: './usuario-actions.component.css',
  viewProviders: [provideIcons({ 
    lucideCheck,
    lucideX,
    lucidePlus,
    lucideTrash
  })]
})
export class UsuarioActionsComponent implements OnInit,OnDestroy{

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;
  
  @Input() type_actions:'actualizar'|'eliminar'|'crear' = 'crear';
  @Input() long_title:boolean = false;
  @Input() icons:boolean = false;
  @Input() show_title:boolean = true;
  @Input() usuario?:PersonaModel;
  @Input() index?:number;

  @Output() create:EventEmitter<PersonaModel> = new EventEmitter();
  @Output() update:EventEmitter<{estrategia:PersonaModel,index:number}> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();
  
  save_loading:boolean = false;
  disabled:boolean = true;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;

  get title(){
    let title:string = `${this.type_actions}${this.long_title?' usuario':''}`;
    title = title.split(' ').map((w)=>{
      return w.split('').map((c,i)=>i==0?c.toUpperCase():c).join('');
    }).join(' ');
    return title;
  }

  get icon(){
    switch (this.type_actions) {
      case 'actualizar':
        return this.usuario && this.usuario.is_active ? 'lucideCheck':'lucideX';
      case 'crear':
        return 'lucidePlus';
      case 'eliminar':
        return 'lucideTrash'
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.closeValidSub();
    this.closeModalSub();
    this.resetDataSub();
  }


  private closeValidSub(){
    if(this.valid_sub)this.valid_sub.unsubscribe();
  }

  private closeModalSub(){
    if(this.modal_sub)this.modal_sub.unsubscribe();
  }

  private resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

}
