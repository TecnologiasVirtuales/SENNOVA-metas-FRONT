import { CommonModule } from '@angular/common';
import { Component, inject, Renderer2 } from '@angular/core';
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
import { Subscription } from 'rxjs';

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
    NgIconComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  viewProviders: [provideIcons({ 
    heroIdentification,
    heroEye,
    heroEyeSlash,
    heroLockClosed
  })]
})
export class LoginComponent {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private renderer = inject(Renderer2);

  loading:boolean = false;
  showPassword:boolean = false;
  passwordType:'text'|'password'= 'password'
  passwordIcon:'heroEyeSlash'|'heroEye' = 'heroEyeSlash';

  form:FormGroup;

  constructor(){
    this.form = this.formBuilder.group({
      documento: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]*$')]),
      password: new FormControl(null,[Validators.required])
    });
  }

  onFocus(event:FocusEvent){
    const group = (event.target as HTMLElement).closest('.form-group');
    this.renderer.addClass(group, 'form-group_focus');
  }

  onBlur(event: FocusEvent) {
    const group = (event.target as HTMLElement).closest('.form-group');
    this.renderer.removeClass(group, 'form-group_focus');
  }

  onShowPassword(){
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      this.passwordType = 'text';
      this.passwordIcon = 'heroEye';
      return;
    }
    this.passwordType = 'password';
    this.passwordIcon = 'heroEyeSlash';
  }

  submitForm(){
    const {value} = this.form;
    this.loading = true;
    const login_sub = this.authService.login(value)
      .subscribe({
        next:(token)=>{
          console.log(token);
        },
        error:()=>{
          this.loading = false;
          login_sub.unsubscribe();
        },
        complete:()=>{
          this.loading = false;
          login_sub.unsubscribe();
        }
      });
  }

}
