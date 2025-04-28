// src/app/services/finanzas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FinanzasService {

  constructor(private http: HttpClient) { }

  getDashboardData(filters: any) {
    return this.http.post('/api/finanzas/dashboard', filters);
  }
}