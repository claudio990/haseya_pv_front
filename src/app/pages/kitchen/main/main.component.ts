import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  orders = [
    {
      id: 1,
      items: [
        { name: 'Pizza Margarita', quantity: 2 },
        { name: 'Ensalada César', quantity: 1 }
      ]
    },
    {
      id: 2,
      items: [
        { name: 'Hamburguesa', quantity: 3 },
        { name: 'Papas Fritas', quantity: 2 }
      ]
    }, {
      id: 1,
      items: [
        { name: 'Pizza Margarita', quantity: 2 },
        { name: 'Ensalada César', quantity: 1 }
      ]
    },
    {
      id: 2,
      items: [
        { name: 'Hamburguesa', quantity: 3 },
        { name: 'Papas Fritas', quantity: 2 }
      ]
    },
    {
      id: 1,
      items: [
        { name: 'Pizza Margarita', quantity: 2 },
        { name: 'Ensalada César', quantity: 1 }
      ]
    },
    {
      id: 2,
      items: [
        { name: 'Hamburguesa', quantity: 3 },
        { name: 'Papas Fritas', quantity: 2 }
      ]
    }
  ];

  confirmFinish(orderId: number) {
    const confirmAction = confirm('¿Seguro que deseas marcar esta comanda como terminada?');
    if (confirmAction) {
      this.finishOrder(orderId);
    }
  }

  finishOrder(orderId: number) {
    this.orders = this.orders.filter(order => order.id !== orderId);
  }
}
