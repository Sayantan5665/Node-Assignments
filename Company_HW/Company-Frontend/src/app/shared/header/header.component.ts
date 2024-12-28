import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services';
import {MatMenuModule} from '@angular/material/menu';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatMenuModule, UpperCasePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected userDetails:any = {};

  constructor() { }

  protected isLoggedIn(): boolean {
    this.userDetails = this.authService.getUserData();
    return this.authService.isLoggedIn();
  }

  protected logout() {
    this.authService.logout();
    this.userDetails = {};
    this.router.navigate(['/login']);
  }
}
