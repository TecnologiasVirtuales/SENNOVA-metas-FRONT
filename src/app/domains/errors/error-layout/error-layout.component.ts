import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { TokenService } from '@shared/services/token.service';

@Component({
  selector: 'app-error-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './error-layout.component.html',
  styleUrl: './error-layout.component.css'
})
export class ErrorLayoutComponent implements OnInit {
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
