import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePlus, lucideSquarePen, lucideTrash, lucideUserMinus, lucideUserPlus, lucideUserRoundCog, lucideX } from '@ng-icons/lucide';
import { ModalFooterComponent } from '@shared/components/modal-footer/modal-footer.component';
import { PersonaModel } from '@shared/models/persona.model';
import { AdminUsuariosService } from '@shared/services/admin-usuarios.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Subscription } from 'rxjs';
import { UsuarioRolesFormComponent } from '../usuario-roles-form/usuario-roles-form.component';
import { AdminRolesUsuarioService } from '@shared/services/admin-roles-usuario.service';
import { ChangeRolesDto } from '@shared/dto/auth/change-roles.dto';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { RegisterDto } from '@shared/dto/auth/register.dto';
import { AuthService } from '@shared/services/auth.service';


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
    lucidePlus,
    lucideTrash,
    lucideUserRoundCog,
    lucideUserMinus,
    lucideUserPlus,
    lucideSquarePen
  })]
})
export class UsuarioActionsComponent implements OnInit,OnDestroy{

  @ViewChild('saveFooter', { static: true }) footerSaveTemplate!: TemplateRef<any>;
  @ViewChild('alertFooter', { static: true }) footerAlertTemplate!: TemplateRef<any>;
  @ViewChild('alertContent', { static: true }) contentAlertTemplate!: TemplateRef<any>;
  
  @Input() type_actions:'actualizar'|'eliminar'|'registrar'|'toggle'|'roles' = 'registrar';
  @Input() long_title:boolean = false;
  @Input() icons:boolean = false;
  @Input() show_title:boolean = true;
  @Input() usuario?:PersonaModel;
  @Input() index?:number;

  @Output() create:EventEmitter<PersonaModel> = new EventEmitter();
  @Output() update:EventEmitter<{usuario:PersonaModel,index:number}> = new EventEmitter();
  @Output() setLoading:EventEmitter<boolean> = new EventEmitter();

  private usuario_service = inject(AdminUsuariosService);
  private roles_usuario_service = inject(AdminRolesUsuarioService);
  private auth_service = inject(AuthService);

  private modal_service = inject(NzModalService);
  private view_container_ref = inject(ViewContainerRef);
  
  save_loading:boolean = false;
  disabled:boolean = true;

  data_sub?:Subscription;
  valid_sub?:Subscription;
  modal_sub?:Subscription;

  instance?:UsuarioRolesFormComponent|UsuarioFormComponent;
  modal?:NzModalRef;

  get title(){
    let action:string = this.type_actions;
    if(this.type_actions==='toggle') action = this.usuario!.is_active ? 'Desactivar' : 'Activar';
    let title:string = `${action}${this.long_title?' usuario':''}`;
    if(this.type_actions==='actualizar') title = title.split(' ').map((w,i)=>{
      if(i == title.split(' ').length){
        console.log(i);
        return 'Perfil'
      }
      return w;
    }).join(' ');

    title = title.split(' ').map((w)=>{
      return w.split('').map((c,i)=>i==0?c.toUpperCase():c).join('');
    }).join(' ');
    return title;
  }

  get icon(){
    switch (this.type_actions) {
      case 'actualizar':
        return 'lucideSquarePen';
      case 'registrar':
        return 'lucideUserPlus';
      case 'eliminar':
        return 'lucideTrash';
      case 'toggle':
        return this.usuario && this.usuario.is_active ? 'lucideUserMinus':'lucideUserPlus';
      case 'roles':
        return 'lucideUserRoundCog';
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.closeValidSub();
    this.closeModalSub();
    this.resetDataSub();
  }

  private startValidSub(){
    if(!this.instance)return;
    this.valid_sub = this.instance!.form.valueChanges
    .subscribe({
      next:()=>{
        const {form} = this.instance!;
        this.disabled = form.invalid;
      }
    });
  }

  private startModalSub(){
    if(!this.instance)return;
    this.modal_sub = this.modal!.afterClose
    .subscribe({
      next:(response)=>{
        if(!response)return this.loadingStatus(false);
        const {form} = response;
        if(!form) return this.loadingStatus(false);
        if(!this.instance) return;
        switch(true){
          case this.instance instanceof UsuarioRolesFormComponent:
            this.changeRoles(form);
            break;
          case this.instance instanceof UsuarioFormComponent:
            this.type_actions === 'actualizar' 
              ? this.actualizarUsuario(form)
              : this.registrarUsuario(form);
            break;
        }
        return this.loadingStatus(false);
      }
    });
  }

  openRegisterForm(){
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:UsuarioFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{actualizar_perfil:this.type_actions === 'actualizar'},
      nzFooter:this.footerSaveTemplate,
      nzWidth:'500px',
      nzDraggable:true,
      nzMaskClosable:false,
      nzClosable:false
    });
    this.instance = this.modal.getContentComponent();
    this.startModalSub();
    this.startValidSub();
  }

  openRoleForm(){
    this.modal = this.modal_service.create({
      nzTitle:this.title,
      nzContent:UsuarioRolesFormComponent,
      nzViewContainerRef:this.view_container_ref,
      nzData:{documento:this.usuario!.per_documento},
      nzFooter:this.footerSaveTemplate,
      nzWidth:'500px',
      nzDraggable:true,
      nzMaskClosable:false,
      nzClosable:false
    });

    this.instance = this.modal.getContentComponent();
    this.startModalSub();
    this.startValidSub();
  }

  private registrarUsuario(form:RegisterDto){
    this.loadingStatus(true);
    this.usuario_service.create(form)
    .subscribe({
      next:(usuario)=>{
        this.create.emit(usuario);
      },
      complete:()=>{
        this.loadingStatus(false);
      }
    })
  }
  private actualizarUsuario(form:RegisterDto){
    this.loadingStatus(true);
    this.auth_service.updateProfile(form)
      .subscribe({
        complete:()=>{
          this.loadingStatus(false);
        }
      })
  }

  private changeRoles(form:ChangeRolesDto){
    if(!this.usuario) return;
    let {per_documento} = this.usuario;
    this.roles_usuario_service.changeRoles(per_documento,form)
      .subscribe({
        next:()=>{
          let usuario = this.auth_service.usuario();
          if(usuario && usuario.per_documento === this.usuario?.per_documento){
            this.auth_service.me().subscribe((usuario)=>{
              this.auth_service.usuario.set(usuario);
            });
          }

        },
        complete:()=>{
          this.loadingStatus(false);
        }
      });
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

  private loadingStatus(status:boolean){
    this.save_loading = status;
    this.setLoading.emit(this.save_loading);
  }

  onToggle(){
    this.loadingStatus(true);
    this.resetDataSub();
    let {per_documento} = this.usuario!;
    this.data_sub = this.usuario_service.toggleUser(per_documento)
      .subscribe({
        next:(usuario)=>{
          this.update.emit({usuario:usuario,index:this.index!});
          this.loadingStatus(false);
        }
      });
  }

  handleGuardar(){
    this.instance?.submitForm();
    this.loadingStatus(true);
  }

  handleCancelar(){
    this.modal?.destroy({form:null});
  }

}
