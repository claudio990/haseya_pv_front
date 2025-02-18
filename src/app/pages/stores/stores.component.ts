import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent {

  stores: any = [{name: 'Alas Flautas'}]
  addStore() {
    const storeName = prompt('Ingrese el nombre de la tienda:');
    if (storeName) {
      // this.storeService.addStore({ name: storeName });
    }
  }
}
