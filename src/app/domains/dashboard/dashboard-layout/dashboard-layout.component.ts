import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavBarComponent } from '@core/components/sidebar-nav-bar/sidebar-nav-bar.component';
import { TopNavBarComponent } from '@core/components/top-nav-bar/top-nav-bar.component';
import { SenaLoadingComponent } from '@shared/components/sena-loading/sena-loading.component';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NzLayoutModule,
    TopNavBarComponent,
    SidebarNavBarComponent,
    NzBreadCrumbModule,
    NzSpinModule,
    SenaLoadingComponent
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit{

  private token_service = inject(TokenService);
  private auth_service = inject(AuthService);

  sidebarCollapsed:boolean = false;
  loading_user = this.auth_service.loading_user;

  user = this.auth_service.usuario;

  ngOnInit(): void {
    if(this.token_service.getToken() && !Boolean(this.user())){
      const usuario_sub = this.auth_service.me()
        .subscribe({
          next:(usuario)=>{
            this.auth_service.usuario.set(usuario);
            this.loading_user.update(()=>false);
          },
          error:()=>usuario_sub.unsubscribe(),
          complete:()=> usuario_sub.unsubscribe()
        });
    }
  }
}
