import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpService } from './http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreServiceService {
 url = environment.url_api;
  token = localStorage.getItem('token')
  options = {
    headers: {
      'Authorization' : `Bearer ${this.token}`
    },
  };
  constructor(private http: HttpClient, private httpService: HttpService) { }


  getStores()
  {
    return this.httpService.ejectQuery('getStores');
  }
  getStore(query:any)
  {
    return this.httpService.ejectQuery('getStore', query);
  }
  addStore(query:any)
  {
    return this.httpService.ejectPost('addStore', query, this.options);
  }
  editStore(query:any)
  {
    return this.httpService.ejectPost('editStore', query, this.options);
  }
  deleteStore(query:any)
  {
    return this.httpService.ejectPost('deleteStore', query);
  }


  //Coupons
  getCoupons(query:any)
  {
    return this.httpService.ejectQuery('getCoupons', query);
  }
  addCoupon(query:any)
  {
    return this.httpService.ejectPost('addCoupon', query, this.options);
  }
  deleteCoupon(query:any)
  {
    return this.httpService.ejectPost('deleteCoupon', query);
  }


  //DashBoard

  getDashboardData(id_store?: number, period: 'day' | 'week' | 'month' = 'month'): Observable<any> {
    const params: any = { period };
    if (id_store !== undefined) {
      params.id_store = id_store;
    }
    return this.httpService.ejectQuery('dashboard', params);
  }
}
