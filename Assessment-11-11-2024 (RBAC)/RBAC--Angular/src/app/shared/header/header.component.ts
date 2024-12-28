import { Component, computed, effect, inject, output, PLATFORM_ID, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@services';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);

  protected sidenav = output<'open' | 'close'>();
  private isSidenavOpen: WritableSignal<boolean> = signal<boolean>(true);
  protected isLoggedIn:Signal<boolean> = computed(() => this.auth.isLoggedIn2());
  protected user:any;

  constructor () {
    effect(() => {
      const isLoggedIn = this.isLoggedIn();
      if(isLoggedIn) {
        this.user = this.auth.getUserData();
      }
    })
  }

  protected openClose() {
    this.isSidenavOpen.set(!this.isSidenavOpen());
    this.sidenav.emit(this.isSidenavOpen() ? 'open' : 'close');
  }
}
