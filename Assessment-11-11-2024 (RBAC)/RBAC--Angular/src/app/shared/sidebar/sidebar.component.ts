import { TitleCasePipe } from '@angular/common';
import { Component, computed, effect, inject, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  protected user:any = this.authService.getUserData();
  private isProfileUpdated:Signal<number> = computed(() => this.authService.profileUpdated());

  constructor() {
    effect(() => {
      const isProfileUpdated = this.isProfileUpdated();
        this.user = this.authService.getUserData();
    });
  }

  isProductEditActive() {
    return this.router.url.includes('/edit/product/');
  }

  protected logout() {
    this.authService.logout();
    this.authService.isLoggedIn2.set(false);
    this.router.navigate(['login']);
    console.log("logout 1");
  }
}
