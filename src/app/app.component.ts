import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
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

