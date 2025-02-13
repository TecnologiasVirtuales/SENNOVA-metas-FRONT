import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { side_routes } from '@core/sidebar.routes';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChartPie } from '@ng-icons/heroicons/outline';
import { heroAcademicCapSolid, heroHomeModernSolid, heroMapSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { lucideSchool } from '@ng-icons/lucide';
import { simpleLevelsdotfyi } from '@ng-icons/simple-icons';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { HasChildrenPipe } from '@shared/pipes/has-children.pipe';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-sidebar-nav-bar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NzMenuModule,
    NgIconComponent,
    NzFlexModule,
    NzGridModule,
    NzTypographyModule,
    NzPopoverModule,
    CanUseActionsDirective,
    HasChildrenPipe
  ],
  templateUrl: './sidebar-nav-bar.component.html',
  styleUrl: './sidebar-nav-bar.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid,
    heroHomeModernSolid,
    heroMapSolid,
    heroChartPie,
    lucideSchool,
    simpleLevelsdotfyi,
    heroUserGroupSolid
  })]
})
export class SidebarNavBarComponent {

  @Input({required:true}) collapsed:boolean = false;

  opciones_menu = side_routes;
}
