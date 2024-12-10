import { Directive, inject, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
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

  constructor() {
    this.usuario_sub = this.usuario_obs.subscribe({
      next: (usuario) => {
        const { is_superuser } = usuario ?? { is_superuser: false };
        if (is_superuser) {
          this.view_container.createEmbeddedView(this.template_ref);
        } else {
          this.view_container.clear();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.usuario_sub.unsubscribe();
  }

}
