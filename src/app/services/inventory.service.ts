import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private httpService: HttpService) { }

  getInventory(query:any)
  {
    return this.httpService.ejectQuery('getInventory', query);
  }

  getInventories()
  {
    return this.httpService.ejectQuery('getInventories');
  }

  addInventory(query:any)
  {
    return this.httpService.ejectPost('addInventory', query);
  }

  updateInventory(query:any)
  {
    return this.httpService.ejectPost('updateInventory', query);
  }

  finishInventory(query:any)
  {
    return this.httpService.ejectPost('finishInventory', query);
  }
}
