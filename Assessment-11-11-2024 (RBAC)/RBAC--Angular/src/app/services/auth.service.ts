import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { StorageService } from '@services';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = inject(StorageService)

  constructor() { }

  public isLoggedIn(): boolean {
    return !!this.storage.getToken().length;
  }

  public isLoggedIn2:WritableSignal<boolean> = signal(!!this.storage.getToken().length);
  public profileUpdated:WritableSignal<number> = signal(999999);

  public getUserData() {
    return this.storage.getData();
  }

  public logout(): void {
    this.storage.removeData();
    console.log("logout 2");
  }
}
