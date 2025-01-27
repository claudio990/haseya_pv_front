import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private httpService: HttpService) { }


  //Clients Routes

  getClients()
  {
    return this.httpService.ejectQuery('clients');
  }

  getClient(query:any)
  {
    return this.httpService.ejectQuery('client', query);
  }

  addClient(query:any)
  {
    return this.httpService.ejectPost('addClient', query);
  }

  editClient(query:any)
  {
    return this.httpService.ejectPost('editClient', query);
  }

  deleteClient(query:any)
  {
    return this.httpService.ejectPost('deleteClient', query);
  }

  getDashboard()
  {
    return this.httpService.ejectQuery('getDashboard');
  }
}
