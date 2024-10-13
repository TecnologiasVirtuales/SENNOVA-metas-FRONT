import { Component, Input } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-sena-loading',
  standalone: true,
  imports: [
    NzFlexModule
  ],
  templateUrl: './sena-loading.component.html',
  styleUrl: './sena-loading.component.css'
})
export class SenaLoadingComponent {

  @Input({required:true}) loading:boolean = true;

}
