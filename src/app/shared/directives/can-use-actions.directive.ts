import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/services/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCanUseActions]',
  standalone: true
})
export class CanUseActionsDirective implements OnDestroy {

  private template_ref = inject(TemplateRef<any>);
  private view_container = inject(ViewContainerRef);
  private auth_service = inject(AuthService);
  private usuario_obs = toObservable(this.auth_service.usuario);
  private usuario_sub: Subscription;

  @Input('appCanUseActions') allowedRoles: string[] = [];

  roles = this.auth_service.roles;

  constructor() {
    this.usuario_sub = this.usuario_obs.subscribe({
      next: (usuario) => {
        if (!usuario) {
          this.view_container.clear();
          return;
        }
        const { is_superuser } = usuario;
        if (is_superuser) {
          if (this.view_container.length === 0) {
            this.view_container.createEmbeddedView(this.template_ref);
          }
          return;
        }
                
        let allow_rol = this.roles().some(r => 
          this.allowedRoles.some(ar => ar.toLowerCase() === r.toLowerCase())
        );
        if (allow_rol) {
          if (this.view_container.length === 0) {
            this.view_container.createEmbeddedView(this.template_ref);
          }
          return;
        }
        this.view_container.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.usuario_sub.unsubscribe();
  }

}
