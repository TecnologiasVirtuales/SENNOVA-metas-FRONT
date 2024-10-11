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
export class AppComponent {}

