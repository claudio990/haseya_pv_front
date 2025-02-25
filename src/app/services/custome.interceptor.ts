import { HttpInterceptorFn } from '@angular/common/http';
import { StorageService } from './storage.service';


export const customeInterceptor: HttpInterceptorFn = (req, next) => {
  
  // const token = localStorage.getItem('token');
  
  
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${req.body}`),
  })

  return next(req);
};
