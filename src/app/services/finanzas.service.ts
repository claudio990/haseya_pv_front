// src/app/services/finanzas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {
  url = environment.url_api;
  token = localStorage.getItem('token')
  options = {
    headers: {
      'Authorization' : `Bearer ${this.token}`
    },
  };

  constructor(private http: HttpClient, private httpService: HttpService) { }


  getDashboardData(filters: any) {
    return this.http.post('/api/finanzas/dashboard', filters);
  }

  obtenerResumenVentas(): Observable<any> {
    return this.httpService.ejectQuery<any>('dashboard');
  }


  getTypes()
  {
    return this.httpService.ejectQuery('getTypes');
  }
  addType(query:any)
  {
    return this.httpService.ejectPost('addType', query);
  }
  deleteTypes(query:any)
  {
    return this.httpService.ejectPost('deleteType', query);
  }
  editType(query:any)
  {
    return this.httpService.ejectPost('editType', query);
  }
}