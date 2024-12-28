import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  private baseApi = "http://localhost:5300/api";

  constructor() { }

  public get(url:string) {
    return this.http.get(`${this.baseApi}/${url}`).pipe(catchError(this.errHandler));
  }

  public post(url:string, data: any) {
    return this.http.post(`${this.baseApi}/${url}`, data).pipe(catchError(this.errHandler));
  }
  public put(url:string, data: any) {
    return this.http.put(`${this.baseApi}/${url}`, data).pipe(catchError(this.errHandler));
  }

  public delete(url:string) {
    return this.http.delete(`${this.baseApi}/${url}`).pipe(catchError(this.errHandler));
  }


  private errHandler(error: any) {
    return throwError(() => error || "Server Error!");
  }
}
