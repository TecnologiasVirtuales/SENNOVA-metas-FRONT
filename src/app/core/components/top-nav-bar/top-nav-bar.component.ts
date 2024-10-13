import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {NzDividerModule} from 'ng-zorro-antd/divider'
import { AuthService } from '@shared/services/auth.service';
import { RefreshDto } from '@shared/dto/auth/refresh.dto';
import { TokenService } from '@shared/services/token.service';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-top-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzFlexModule,
    NzGridModule,
    NzAvatarModule,
    NzMenuModule,
    NzButtonModule,
    NzTypographyModule,
    NzDropDownModule,
    NzDividerModule,
    NzSkeletonModule
  ],
  templateUrl: './top-nav-bar.component.html',
  styleUrl: './top-nav-bar.component.css'
})
export class TopNavBarComponent {

  auth_service = inject(AuthService);
  token_service = inject(TokenService);

  usuario = this.auth_service.usuario;
  loading_user = this.auth_service.loading_user;

  onLogOut(){
    const refresh:RefreshDto = {
      refresh: this.token_service.getRefresh() ?? ''
    }
    this.loading_user.update(()=>true);
    const sesionSub = this.auth_service.logOut(refresh)
      .subscribe({
        next:()=>{
          this.loading_user.update(()=>false);
        },
        error:()=>{
          sesionSub.unsubscribe();
        },
        complete:()=>{
          sesionSub.unsubscribe();
        }
      });
  }

}
