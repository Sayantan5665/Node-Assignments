import { inject, Injectable } from '@angular/core';
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

  public getUserData() {
    return this.storage.getData();
  }

  public logout(): void {
    this.storage.removeData();
  }
}
