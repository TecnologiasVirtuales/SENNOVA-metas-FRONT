import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHomeModernSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-go-to-dashboard-button',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent
  ],
  templateUrl: './go-to-dashboard-button.component.html',
  styleUrl: './go-to-dashboard-button.component.css',
  viewProviders: [provideIcons({ 
    heroHomeModernSolid,
  })]
})
export class GoToDashboardButtonComponent {
  private route = inject(Router);

  button_clicked = false;

  goToDashboard(){
    if(this.button_clicked)return;
    this.button_clicked = true;
    this.route.navigate(['dashboard','reportes']);
  }
}
