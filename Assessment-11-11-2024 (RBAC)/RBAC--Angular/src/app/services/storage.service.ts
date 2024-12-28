import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private cookie = inject(CookieService);

  constructor() { }

  public setData(data: any) {
    window.sessionStorage.setItem('name', data['name']);
    window.sessionStorage.setItem('email', data['email']);
    window.sessionStorage.setItem('role', data['role']);
    window.sessionStorage.setItem('image', data['image']);
    window.sessionStorage.setItem('id', data['_id']);
    // window.sessionStorage.setItem('token', data['auth-token']);
    this.cookie.set('token', data['token'], 7, '/', '', false, 'Strict', false);
  }

  public getData() {
    return {
      name: window.sessionStorage.getItem('name'),
      email: window.sessionStorage.getItem('email'),
      image: window.sessionStorage.getItem('image'),
      role: window.sessionStorage.getItem('role'),
      id: window.sessionStorage.getItem('id'),
    };
  }

  public getToken() {
    // return window.sessionStorage.getItem('token');
    return this.cookie.get('token');
  }

  public removeData() {
    window.sessionStorage.clear();
    this.cookie.delete('token', '/');
    this.cookie.delete('token');
  }
}
