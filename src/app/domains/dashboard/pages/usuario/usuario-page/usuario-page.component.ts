import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { lucideSearch } from '@ng-icons/lucide';
import { SearchCellComponent } from '@shared/components/search-cell/search-cell.component';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { PersonaModel } from '@shared/models/persona.model';
import { TipoDocumentoPipe } from '@shared/pipes/tipo-documento.pipe';
import { AdminUsuariosService } from '@shared/services/admin-usuarios.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { UsuarioActionsComponent } from '../components/usuario-actions/usuario-actions.component';

@Component({
  selector: 'app-usuario-page',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzSpaceModule,
    NzGridModule,
    NgIconComponent,
    NzTableModule,
    SenaLoadingComponent,
    NzDropDownModule,
    FormsModule,
    TipoDocumentoPipe,
    NzDividerModule,
    SearchCellComponent,
    NzPaginationModule,
    UsuarioActionsComponent
  ],
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.component.css',
  viewProviders: [provideIcons({ 
    heroUserGroupSolid,
    lucideSearch
  })]
})
export class UsuarioPageComponent implements OnInit,OnDestroy{

  private usuarios_service = inject(AdminUsuariosService);

  private data_sub?:Subscription;

  loading:boolean = false;
  search_status:boolean = false;

  search_value:string = '';

  usuarios:PersonaModel[] = [];
  num_usuarios:number = 0;

  page:number = 1;
  page_size:number = 10;

  buscar_usuario:boolean = false;
  documento_usuario?:number;

  ngOnInit(): void {
    this.onLoad(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.resetDataSub();
  }

  get filters(){
    let filters:{[key:string]:number|string} = {};
    if(this.documento_usuario) filters['per_documento'] = this.documento_usuario;
    return filters;
  }

  private getUsuarios(){
    return this.usuarios_service.getAll({filter:this.filters,page_number:this.page,page_size:this.page_size});
  }

  private loadData(){
    this.resetDataSub();
    this.data_sub = this.getUsuarios()
      .subscribe({
        next:(p_usuarios)=>{
          let {count,results} = p_usuarios;
          this.usuarios = [...results];
          this.num_usuarios = count;
        },
        complete:()=>{
          this.onLoad(false);
        }
      })
  }

  private resetDataSub(){
    if(this.data_sub) this.data_sub.unsubscribe();
  }

  onCreateUsuario(usuario:PersonaModel){
    this.usuarios = [...this.usuarios,usuario];
  }
  

  onUpdate(data:{usuario:PersonaModel, index:number}) {    
    let {usuario,index} = data;
    let usuarios = [...this.usuarios];
    usuarios[index] = usuario;
    this.usuarios = [...usuarios];
  }

  onSearch(search:string){
    this.documento_usuario = parseInt(search);
    this.loadData();
  }

  onResetSearch(){
    this.documento_usuario = undefined;
    this.loadData();
  }

  changePage(p_page:number){
    this.page = p_page;
    this.loadData();
  }

  onLoad(loadStatus:boolean){    
    this.loading = loadStatus;
  }

}
