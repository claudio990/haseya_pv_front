import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.url_api;
  options = {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'contentType': "application/x-www-form-urlencoded"
    },
  };

  constructor(private http: HttpClient, private httpService: HttpService) { }

  login(query: any)
  {
    return this.http.post(this.url+ 'login',query);
  }

  getEmployees()
  {
    return this.httpService.ejectQuery('getEmployees');
  }

  registerEmployee(query:any)
  {
    return this.httpService.ejectPost('register', query);
  }

  getEmployeeStore(query:any)
  {
    return this.httpService.ejectQuery('getEmployeesStore', query);
  }

}
