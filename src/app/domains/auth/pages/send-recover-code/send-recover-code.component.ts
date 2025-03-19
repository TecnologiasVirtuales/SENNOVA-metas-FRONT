import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroIdentification } from '@ng-icons/heroicons/outline';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { AuthService } from '@shared/services/auth.service';
import { NotificationNoteService } from '@shared/services/notification-note.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-send-recover-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzFlexModule,
    NzTypographyModule,
    NgIconComponent,
    OnlyNumbersDirective,
    RouterModule
  ],
  templateUrl: './send-recover-code.component.html',
  styleUrls: [
    './send-recover-code.component.css',
    '../../../../shared/styles/forms.style.css'
  ],
  viewProviders: [provideIcons({ 
    heroIdentification,
  })]
})
export class SendRecoverCodeComponent extends FormStyle{
  private notification_service = inject(NotificationNoteService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  @ViewChild('submitButton') submit_button:ElementRef = {} as ElementRef;

  loading:boolean = false;

  form:FormGroup;

  constructor(){
    super();
    this.form = this.formBuilder.group({
      document: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]*$')]),
    });      
  }

  submitForm(){
    const { value } = this.form;
    this.loading = true;
    this.authService.sendRecoverEmail(value)
      .subscribe({
        next: () => {
          this.router.navigate(['/auth','inicio-sesion']);
        },
        error: () => {
          this.notification_service.error('Ocurrio un error','No fue posible enviar la solicitud');
          this.loading = false;
        },
        complete: () => {
          this.notification_service.success('Proceso exitoso','por favor revisa tu correo electrónico');
          this.loading = false;
        }
      });
  }
}
