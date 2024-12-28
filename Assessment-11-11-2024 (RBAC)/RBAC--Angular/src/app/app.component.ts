import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivationEnd, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Assessment-11-11-2024';
  private document = inject(DOCUMENT);
  private router = inject(Router);

  protected pageLoad: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) this.pageLoad.set(false);
      if (e instanceof NavigationEnd) this.pageLoad.set(true);
    });
  }

  protected sidenavOpenClose(event: 'open' | 'close') {
    const navContainer: Element | null = this.document.querySelector('.body-container');
    if (navContainer) {
      navContainer.classList.toggle('sidenav-open', event === 'open');
      navContainer.classList.toggle('sidenav-close', event === 'close');
    }
  }
}
