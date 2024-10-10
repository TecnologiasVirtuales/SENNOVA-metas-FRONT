import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzFlexModule,
    NzGridModule,
    NzAvatarModule,
    NzMenuModule
  ],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.css'
})
export class TopNavBarComponent {

}
