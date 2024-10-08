import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  
  form:FormGroup;

  constructor(){
    this.form = this.formBuilder.group({
      documento:new FormControl(null,[Validators.required]),
      password:new FormControl(null,[Validators.required])
    });
  }

  ngOnInit(): void {
      
  }

  login(){
    const {value} = this.form;
    this.authService.login(value)
      .subscribe({
        next:(token)=>{
          console.log(token);
        }
      });
  }
  
}
