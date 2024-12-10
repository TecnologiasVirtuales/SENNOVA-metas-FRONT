import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { lucideSearch } from '@ng-icons/lucide';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { PersonaModel } from '@shared/models/persona.model';
import { TipoDocumentoPipe } from '@shared/pipes/tipo-documento.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';

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
    NzDividerModule
  ],
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.component.css',
  viewProviders: [provideIcons({ 
    heroUserGroupSolid,
    lucideSearch
  })]
})
export class UsuarioPageComponent {

  loading:boolean = false;
  search_status:boolean = false;

  search_value:string = '';

  usuarios:PersonaModel[] = [];

  search(){

  }
  resetSearch(){
    this.search_status = true;
  }
}
