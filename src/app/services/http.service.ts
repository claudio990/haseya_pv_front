import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  SERVER_URL = environment.url_api;

  token = localStorage.getItem('token')

  options = {
    headers : {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment',
      'Authorization' : `Bearer ${this.token}`
    },
  };


  constructor(private http: HttpClient) { }


  ejectQuery<T>(url: string, query: Record<string, string> = {}, options = {}): Observable<T> {
    const queryString = new URLSearchParams(query).toString();

    return this.http.get<T>(`${this.SERVER_URL}${url}?${queryString}` , {
      ...this.options,
      ...options
    });
  };

  ejectPost<T>(url: string, data: any, options = {}) {
    return this.http.post(`${this.SERVER_URL}${url}`, data, {
      ...this.options,
      ...options
    });
  };

  ejectPatch<T>(url: string, data: any, options = {}) {
    return this.http.patch(`${this.SERVER_URL}${url}`, data, {
      ...this.options,
      ...options
    });
  };

  
  downloadFile(file_url: string, file_name: string) {
    return this.http.get(file_url, {
      responseType: 'blob'
    });
  }


}
