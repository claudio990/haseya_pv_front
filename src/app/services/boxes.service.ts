import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {
  url = environment.url_api;
  token = localStorage.getItem('token')
  options = {
    headers: {
      'Authorization' : `Bearer ${this.token}`
    },
  };

  constructor(private http: HttpClient, private httpService: HttpService) { }

  validation()
  {
    return this.httpService.ejectQuery('validationBox');
  }
  getBox(query:any)
  {
    return this.httpService.ejectQuery('getBox', query);
  }

  getBoxes(query:any)
  {
    return this.httpService.ejectQuery('getBoxes');
  }

  closeBox(query:any)
  {
    return this.httpService.ejectPost('updateBox', query);
  }


  //Sells

  getSells()
  {
    return this.httpService.ejectQuery('getSells');
  }

}
