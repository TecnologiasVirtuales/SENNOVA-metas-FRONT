import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { side_routes } from '@core/sidebar.routes';
import { MenuItemComponent } from '@shared/components/menu-item/menu-item.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-sidebar-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NzMenuModule,
    MenuItemComponent
  ],
  templateUrl: './sidebar-nav-bar.component.html',
  styleUrl: './sidebar-nav-bar.component.css',
})
export class SidebarNavBarComponent {

  @Input({required:true}) collapsed:boolean = false;

  opciones_menu = side_routes;
}
