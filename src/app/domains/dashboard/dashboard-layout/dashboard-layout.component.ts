import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavBarComponent } from '@core/components/sidebar-nav-bar/sidebar-nav-bar.component';
import { TopNavBarComponent } from '@core/components/top-nav-bar/top-nav-bar.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NzLayoutModule,
    TopNavBarComponent,
    SidebarNavBarComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

}
