import { CommonModule} from '@angular/common';
import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash, heroIdentification, heroLockClosed } from '@ng-icons/heroicons/outline';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { Router, RouterModule } from '@angular/router';
import { FormStyle } from '@shared/style-clases/focus.style';
import { OnlyNumbersDirective } from '@shared/directives/only-numbers.directive';
import { NotificationNoteService } from '@shared/services/notification-note.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../../../../shared/styles/forms.style.css'
  ],
  viewProviders: [provideIcons({ 
    heroIdentification,
    heroEye,
    heroEyeSlash,
    heroLockClosed
  })]
})
export class LoginComponent extends FormStyle {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private notification_service = inject(NotificationNoteService);

  @ViewChild('submitButton') submit_button:ElementRef = {} as ElementRef;

  loading:boolean = false;
  show_password:boolean = false;
  password_type:'text'|'password'= 'password'
  password_icon:'heroEyeSlash'|'heroEye' = 'heroEyeSlash';

  form:FormGroup;

  constructor(){
    super();
    this.form = this.formBuilder.group({
      per_documento: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]*$')]),
      password: new FormControl(null,[Validators.required])
    });      
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
    this.authService.login(value)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.notification_service.error('Credenciales incorrectas','No se pudo iniciar sesión');
          this.loading = false;
        },
        complete: () => {
          this.notification_service.success('Bienvenido','Sesión iniciada correctamente');
          this.loading = false;
        }
      });
  }

}
