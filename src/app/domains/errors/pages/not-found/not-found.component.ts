import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoToDashboardButtonComponent } from '@domains/errors/components/go-to-dashboard-button/go-to-dashboard-button.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    NzResultModule,
    GoToDashboardButtonComponent
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
