import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = environment.url_api;
  token = localStorage.getItem('token')
  options = {
    headers: {
      'Authorization' : `Bearer ${this.token}`
    },
  };

  constructor(private http: HttpClient, private httpService: HttpService) { }

  getCategories()
  {
    return this.httpService.ejectQuery('categories');
  }

  getCategory(query: any)
  {
    return this.httpService.ejectQuery('category', query);
  }

  addCategory(query: any)
  {
    return this.http.post(this.url + 'addCategory', query, this.options);
  }

  editCategory(query: any)
  {
    return this.http.post(this.url + 'editCategory', query, this.options);
  }

  deleteCategory(query: any)
  {
    return this.http.post(this.url + 'deleteCategory', query, this.options);
  }
}
