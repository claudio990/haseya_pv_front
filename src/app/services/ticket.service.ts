import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private httpService: HttpService) { }

  addTicket(query: any)
  {
    return this.httpService.ejectPost('addTicket', query);
  }

  addProductTicket(query:any)
  {
    return this.httpService.ejectPost('addProductTicket', query);
  }

  getTickets(query:any)
  {
    return this.httpService.ejectQuery('getTickets', query);
  }
  getAllTickets()
  {
    return this.httpService.ejectQuery('getAllTickets');
  }

  getTicket(query:any)
  {
    return this.httpService.ejectQuery('getTicket', query);
  }


  //Abonos
  getAbonos(query:any) 
  {
    return this.httpService.ejectQuery('getAbonos', query);
  }

  addAbono(query:any)
  {
    return this.httpService.ejectPost('addAbono', query);
  }


  //Start box 

  addBox(query:any)
  {
    return this.httpService.ejectPost('addBox', query);
  }
  

  //Validation Open Box
  validationBox(query:any)
  {
    return this.httpService.ejectQuery('validationBox', query);
  }
}
