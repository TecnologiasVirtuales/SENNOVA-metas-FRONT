import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleModel } from '@shared/models/role.model';
import { AdminRolService } from '@shared/services/admin-rol.service';
import { AdminUsuariosService } from '@shared/services/admin-usuarios.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { BehaviorSubject, debounceTime, forkJoin, skip, Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario-roles-form',
  standalone: true,
  imports: [
    CommonModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSpinModule
  ],
  templateUrl: './usuario-roles-form.component.html',
  styleUrls: [
    './usuario-roles-form.component.css',
    '../../../../../../shared/styles/forms.style.css'
  ]
})
export class UsuarioRolesFormComponent extends FormStyle implements OnInit,OnDestroy {

  private form_builder = inject(FormBuilder);
  private roles_service = inject(AdminRolService);
  private usuario_service = inject(AdminUsuariosService);
  private modal = inject(NzModalRef);

  form:FormGroup;

  documento?:number;

  roles:RoleModel[] = [];
  is_loading_rol:boolean = true;
  page_rol:number = 1;
  num_rol:number = 10;
  search_rol:string = '';
  search_rol_sub?:Subscription;
  search_rol_subject:BehaviorSubject<string> = new BehaviorSubject('');
  data_sub?:Subscription;

  constructor(){
    super();
    this.form = this.form_builder.group({
      roles:new FormControl<number[]>([])
    });
  }

  ngOnInit(): void {
    forkJoin([
      this.getRoles()
    ]).subscribe({
      next: ([p_roles]) => {
        let {results,count} = p_roles;
        this.roles = [...results];
        this.is_loading_rol = false;
        this.num_rol = count;
      },
      complete:()=>{
        this.configForm();
      }
    })
  }

  ngOnDestroy(): void {
    this.resetDataSub();
    this.resetSearchSub();
  }

  get field_roles(): FormControl<number[]>{
    return this.form.get('roles') as FormControl<number[]>;
  }

  private configForm(){
    this.documento = this.modal.getConfig().nzData.documento;
    this.usuario_service.userRoles(this.documento!)
      .subscribe({
        next:(roles)=>{
          let roles_id = roles.map(r=>r.rol_id);
          this.field_roles.setValue(roles_id);
        },
        complete:()=>{
          this.startSearch();
        }
      });
  }

  private getRoles(){
    let filters:{[key:string]:string|number} = {};    
    if(this.search_rol.trim().length > 0) filters['name'] = this.search_rol;
    return this.roles_service.getAll({page_number:this.page_rol});
  }

  onScrollRol(){
    if(this.num_rol <= this.roles.length) return;
    this.resetDataSub();
    this.is_loading_rol = true;
    this.page_rol = this.page_rol + 1;
    this.data_sub = this.getRoles()
      .subscribe({
        next:(p_roles)=>{
          let {results} = p_roles;
          this.roles = [...this.roles,...results];
          this.is_loading_rol = false;
        }
      });
  }

  onSearchRol(search:string){
    this.is_loading_rol = true;    
    this.search_rol_subject.next(search);
  }

  private executeSearchRol(){
    this.resetDataSub();
    this.page_rol = 1;
    this.data_sub = this.getRoles().subscribe({
      next:(p_roles)=>{
        let {results,count} = p_roles;        
        this.roles = [...results];
        this.num_rol = count;
        this.is_loading_rol = false;
      }
    });
  }

  private startSearch(){
    let search_wait:number = 200;
    let search_skip:number = 1;

    this.search_rol_sub = this.search_rol_subject
      .pipe(
        skip(search_skip),
        debounceTime(search_wait)
      ).subscribe({
        next:(search)=>{          
          this.search_rol = search;
          this.executeSearchRol();
        }
      });
  }

  private resetSearchSub(){
    if(this.search_rol_sub)this.search_rol_sub.unsubscribe();
  }

  private resetDataSub(){
    if(this.data_sub)this.data_sub.unsubscribe();
  }

  submitForm(){
    const {value,valid} = this.form;
    if(valid){
      this.modal.close({form:value});
    }
  }

}
