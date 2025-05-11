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
  getAllTickets(query:any)
  {
    return this.httpService.ejectQuery('getAllTickets', query);
  }
  getTicketsBox(query:any)
  {
    return this.httpService.ejectQuery('getTicketsBox', query);
  }

  getTicket(query:any)
  {
    return this.httpService.ejectQuery('getTicket', query);
  }

  payTicket(query:any)
  {
    return this.httpService.ejectPost('payTicket', query);
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

  //COUPONS
  getCoupons(query: any)
  {
    return this.httpService.ejectQuery('getCoupons', query);
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


  saveWhatsappContact(data: any) {
    return this.httpService.ejectPost('whatsappContact', data);
  }
}
