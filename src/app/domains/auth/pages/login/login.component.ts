import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);

  form:FormGroup;

  constructor(){
    this.form = this.formBuilder.group({
      documento: new FormControl(null,[Validators.required,Validators.pattern('^[0-9]*$')]),
      password: new FormControl(null,[Validators.required])
    });
  }

  submitForm(){
    const {value} = this.form;
    this.authService.login(value)
      .subscribe({
        next:(token)=>{
          console.log(token);
        }
      });
  }

}
