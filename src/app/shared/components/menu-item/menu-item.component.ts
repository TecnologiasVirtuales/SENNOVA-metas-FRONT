import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChartPie, heroLanguage } from '@ng-icons/heroicons/outline';
import { heroAcademicCapSolid, heroHomeModernSolid, heroMapSolid, heroUserGroupSolid } from '@ng-icons/heroicons/solid';
import { lucideSchool } from '@ng-icons/lucide';
import { simpleLevelsdotfyi } from '@ng-icons/simple-icons';
import { HasChildrenPipe } from '@shared/pipes/has-children.pipe';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { CanUseActionsDirective } from '@shared/directives/can-use-actions.directive';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    NzMenuModule,
    NgIconComponent,
    HasChildrenPipe,
    RouterModule,
    NzPopoverModule,
    CanUseActionsDirective,
    NzTypographyModule
  ],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
  viewProviders: [provideIcons({ 
    heroAcademicCapSolid,
    heroHomeModernSolid,
    heroMapSolid,
    heroChartPie,
    lucideSchool,
    simpleLevelsdotfyi,
    heroUserGroupSolid,
    heroLanguage
  })]
})
export class MenuItemComponent implements OnInit{
  @Input({required:true}) route:Route = {};
  @Input() path:string[] = [];
  @Input() collapsed = false;

  ngOnInit(): void {
    let {path} = this.route;
    if(path && !this.path.some((p)=>p === path)){ 
      this.path = [...this.path,path!];
    }
  }
}
