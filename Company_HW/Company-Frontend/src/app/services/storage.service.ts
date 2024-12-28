import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private cookie = inject(CookieService);

  constructor() { }

  public setData(data: any) {
    console.log("data: ", data);
    localStorage.setItem('name', data['name']);
    localStorage.setItem('email', data['email']);
    localStorage.setItem('role', data['role']);
    localStorage.setItem('image', data['image']);
    // sessionStorage.setItem('token', data['auth-token']);
    this.cookie.set('token', data['token']);
  }

  public getData() {
    return {
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      image: localStorage.getItem('image'),
      role: localStorage.getItem('role'),
    };
  }

  public getToken() {
    // return sessionStorage.getItem('token');
    return this.cookie.get('token');
  }

  public removeData() {
    localStorage.clear();
    // sessionStorage.removeItem('token');
    this.cookie.delete('token');
  }
}
