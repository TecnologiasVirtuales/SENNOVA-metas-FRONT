import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoToDashboardButtonComponent } from '@domains/errors/components/go-to-dashboard-button/go-to-dashboard-button.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-not-allowed',
  standalone: true,
  imports: [
    CommonModule,
    NzResultModule,
    GoToDashboardButtonComponent
  ],
  templateUrl: './not-allowed.component.html',
  styleUrl: './not-allowed.component.css'
})
export class NotAllowedComponent {

}
