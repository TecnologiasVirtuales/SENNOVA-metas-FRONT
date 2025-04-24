import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash, heroLockClosed } from '@ng-icons/heroicons/outline';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { AuthService } from '@shared/services/auth.service';
import { NotificationNoteService } from '@shared/services/notification-note.service';
import { FormStyle } from '@shared/style-clases/focus.style';
import { passwordChartsValidators, passwordsMatchValidator } from '@shared/validators/password.validator';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-recover-password',
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
    RouterModule
  ],
  templateUrl: './recover-password.component.html',
  styleUrls: [
    './recover-password.component.css',
    '../../../../shared/styles/forms.style.css'
  ],
  viewProviders: [provideIcons({ 
    heroEye,
    heroEyeSlash,
    heroLockClosed
  })]
})
export class RecoverPasswordComponent extends FormStyle implements OnInit{
  private notification_service = inject(NotificationNoteService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  @Input() token:string = '';

  @ViewChild('submitButton') submit_button:ElementRef = {} as ElementRef;

  loading:boolean = false;
  show_password:boolean = false;
  password_type:'text'|'password'= 'password'
  password_icon:'heroEyeSlash'|'heroEye' = 'heroEyeSlash';

  form:FormGroup;

  constructor(){
    super();
    this.form = this.formBuilder.group({
      token:new FormControl(''),
      password: new FormControl(null,[
        Validators.required,
        Validators.minLength(16),
        passwordChartsValidators.hasSpecialChar(),
        passwordChartsValidators.hasUppercase(),
        passwordChartsValidators.hasDigit()
      ]),
      password2: new FormControl(null,[Validators.required])
    });      
  }

  ngOnInit(): void {
    this.form.get('token')!.setValue(this.token);
    this.form.addValidators(passwordsMatchValidator);
  }

  onShowPassword(){
    this.show_password = !this.show_password;
    if(this.show_password){
      this.password_type = 'text';
      this.password_icon = 'heroEye';
      return;
    }
    this.password_type = 'password';
    this.password_icon = 'heroEyeSlash';
  }

  submitForm(){
    const { value } = this.form;    
    this.loading = true;
    this.authService.passwordChange(value)
      .subscribe({
        next: () => {
          this.router.navigate(['/auth','inicio-sesion']);
        },
        error: () => {
          this.notification_service.error('Ocurrio un error','No fue posible cambiar la contraseña.');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.notification_service.success('Proceso exitoso','La contraseña fue cambiada con exito.');
        }
      });
  }
}
