import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';


interface ICache { [ key: string ]: BehaviorSubject<any>; }


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private cache: ICache;

  constructor(
    private http: HttpService
  ) {
    this.cache = Object.create( null );
  }

  bandActive: boolean = true;

  public set(key: string, value: any, callback = (i:any) => i) {
    localStorage.setItem(key, value);

    if ( this.cache[ key ] ) {
      this.cache[ key ].next( callback(value) );
      return this.cache[ key ];
    }

    return this.cache[ key ] = new BehaviorSubject( callback(value) );
  }

  public get(key:string) {
    return localStorage.getItem(key);
  }

  public getSubscribe(key: string, callback = (i: any) => i ) {
    if ( this.cache[ key ] )
      return this.cache[ key ];
    else
      return this.cache[ key ] = new BehaviorSubject( callback(localStorage.getItem( key )) );
  }

  public remove(key: string) {
    localStorage.removeItem(key);
    if ( this.cache[ key ] )
      this.cache[ key ].next( null );
  }

  public clear() {
    Object.values(this.cache).map(cache => cache.next( null ));
    localStorage.clear();
  }
}
