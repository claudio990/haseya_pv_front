import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

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
    return this.httpService.ejectPost('addStore', query);
  }
  editStore(query:any)
  {
    return this.httpService.ejectPost('editStore', query);
  }
  deleteStore(query:any)
  {
    return this.httpService.ejectPost('deleteStore', query);
  }
}
