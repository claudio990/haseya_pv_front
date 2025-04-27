import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BodyComponent } from './components/body/body.component';
import localeEsMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsMX);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, BodyComponent],
  providers: [{provide: LOCALE_ID, useValue: 'es-MX'}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Flautas pv';
}
