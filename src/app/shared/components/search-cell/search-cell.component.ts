import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-search-cell',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NgIconComponent,
    NzDropDownModule,
    FormsModule,
    OnlyNumbersDirective
  ],
  templateUrl: './search-cell.component.html',
  styleUrl: './search-cell.component.css',
  viewProviders: [provideIcons({ 
    lucideSearch
  })]
})
export class SearchCellComponent {

  @Input({required:true}) visible:boolean = false;

  @Input() searchValue?:string|number;
  @Input() placeHolder:string = 'Buscar';
  @Input() type:'text'|'number' = 'text';

  @Output() search:EventEmitter<string> = new EventEmitter();
  @Output() reset:EventEmitter<void> = new EventEmitter();

  onSearch(){
    if(!this.searchValue) return;
    this.search.emit(this.searchValue.toString());
  }

  onResetSearch(){
    this.reset.emit();
  }

}
