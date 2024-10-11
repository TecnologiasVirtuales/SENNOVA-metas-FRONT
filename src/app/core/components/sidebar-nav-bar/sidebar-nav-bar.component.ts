import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { sideRoutes } from '@core/sidebar.routes';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-sidebar-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule
  ],
  templateUrl: './sidebar-nav-bar.component.html',
  styleUrl: './sidebar-nav-bar.component.css'
})
export class SidebarNavBarComponent {
  opciones_menu = sideRoutes;
}
