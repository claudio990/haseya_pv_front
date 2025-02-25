import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url = environment.url_api;
  token = localStorage.getItem('token')
  options = {
    headers: {
      'Authorization' : `Bearer ${this.token}`
    },
  };


  constructor(private http: HttpClient, private httpService: HttpService) { }

  getProduct(query:any)
  {
    return this.httpService.ejectQuery('product', query);
  }
  getProducts(query: any)
  {
    return this.httpService.ejectQuery('products');
  }
  getProductStore(query: any)
  {
    return this.httpService.ejectQuery('getProductStore', query);
  }

  addProduct(query:any)
  {
    return this.http.post(this.url + 'addProduct', query, this.options);
  }

  editProduct(query:any)
  {
    return this.http.post(this.url + 'editProduct', query, this.options);
  }

  deleteProduct(query:any)
  {
    return this.httpService.ejectPost('deleteProduct', query);
  }



  //Types pay 

  getTypes()
  {
    return this.httpService.ejectQuery('getTypes');
  }

  addType(query:any)
  {
    return this.httpService.ejectPost('addPay', query);
  }

  //down Products

  downs()
  {
    return this.httpService.ejectQuery('getDowns');
  }
  downProduct(query:any)
  {
    return this.httpService.ejectPost('downProduct', query);
  }

  ups()
  {
    return this.httpService.ejectQuery('getUps');
  }
  upProduct(query:any)
  {
    return this.httpService.ejectPost('upProduct', query);
  }
    
}
