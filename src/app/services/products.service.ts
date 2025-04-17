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
  getProductsBox(query: any)
  {
    return this.httpService.ejectQuery('getProductsBox', query);
  }

  addProductsToTicket(products: any[], ticketId: any) {
    return this.httpService.ejectPost('addProductsToTicket', {
      id_ticket: ticketId,
      products: products
    });
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

  // Ingredients
  getIngredient(query:any)
  {
    return this.httpService.ejectQuery('getIngredient', query);
  }
  getIngredients(query: any)
  {
    return this.httpService.ejectQuery('getIngredients', query);
  }
  addIngredient(query:any)
  {
    return this.http.post(this.url + 'addIngredient', query, this.options);
  }

  editIngredient(query:any)
  {
    return this.http.post(this.url + 'editIngredient', query, this.options);
  }

  deleteIngredient(query:any)
  {
    return this.httpService.ejectPost('deleteIngredient', query);
  }

  //Ingredients Products

  getIngredientsProduct(query:any)
  {
    return this.httpService.ejectQuery('getProductIngredients', query);
  }

  addIngredientsProduct(query:any)
  {
    return this.http.post(this.url + 'addProductIngredient', query, this.options);
  }

  deleteIngredientProd(query:any)
  {
    return this.http.post(this.url + 'deleteProductIngredient', query, this.options);
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
