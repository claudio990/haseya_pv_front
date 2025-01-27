import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {  lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null;
  
  constructor(private http: HttpService, private router: Router) {

   }

   async isAuth() : Promise<boolean>
   {
       const res:any = await lastValueFrom(this.http.ejectQuery('auth'));
      
       var band =  res.status == 'active' ? true : false;
       if(!band)
       {
         this.router.navigateByUrl('/login');
       }
       return band;
   }
 
   async noAuth() : Promise<boolean>
   {
     const res:any = await lastValueFrom(this.http.ejectQuery('auth'));
     var band =  res.status != 'active' ? true : false;
     if(!band)
     {
       this.router.navigateByUrl('/main');
     }
     return band;
   }

  
}
