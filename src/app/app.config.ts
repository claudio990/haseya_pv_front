import { ApplicationConfig } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { customeInterceptor } from './services/custome.interceptor';
import { errorInterceptor } from './services/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimations(), 
    provideHttpClient(withFetch()), 
    provideHttpClient(withInterceptors([
      customeInterceptor, 
      errorInterceptor
    ])),
  ]
};
