import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import Swal from 'sweetalert2';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  intervalId: any;
  appRef = inject(ApplicationRef);

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
    this.loadCommands(); // Primera carga

    // Esperar que Angular esté estable
    this.appRef.isStable
      .pipe(takeWhile(isStable => !isStable, true)) // Espera hasta que sea estable
      .subscribe(() => {
        this.intervalId = setInterval(() => {
          this.loadCommands();
        }, 5000);
      });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getComensales(order: any): number[] {
    const comensalesSet = new Set<number>();
    order.items.forEach((item:any) => {
      if (item.comensal) {
        comensalesSet.add(item.comensal);
      }
    });
    return Array.from(comensalesSet).sort((a, b) => a - b);
  }

  getItemsByComensal(order: any, comensal: number): any[] {
  return order.items.filter((item: any) => item.comensal === comensal);
}


  loadCommands() {
    const id_store = localStorage.getItem('id_store');
    const timestamp = new Date().getTime();
  
    this.service.getCommands({ id_store, t: timestamp }).subscribe((res: any) => {
      const oldIds = this.orders.map(o => o.id);
      const now = Date.now();
  
      const newOrders = res.filter((order: any) => !oldIds.includes(order.id));
      const hasNew = newOrders.length > 0;
  
      this.orders = res.map((order: any) => {
        const isNew = !oldIds.includes(order.id);
        return {
          ...order,
          createdAt: isNew ? now : this.orders.find(o => o.id === order.id)?.createdAt || now
        };
      });
  
      if (hasNew) {
        this.playNotificationSound();
      }
    });
  }
  
  isNewOrder(order: any): boolean {
    return Date.now() - order.createdAt < 15000; // 15s
  }
  

playNotificationSound() {
  const audio = new Audio('assets/sounds/notification.mp3');
  audio.play().catch(err => {
    console.warn('Error reproduciendo sonido:', err);
  });
}
  
  

  confirmFinish(orderId: number) {
    Swal.fire({
      title: "¿Seguro que deseas marcar esta comanda como terminada?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, marcar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.updateCommand({ id: orderId })
          .subscribe(() => {
            Swal.fire({
              title: "¡Enviado!",
              text: "Se ha marcado con éxito.",
              icon: "success"
            }).then(() => {
              this.finishOrder(orderId);
            });
          });
      }
    });
  }

  finishOrder(orderId: number) {
    this.orders = this.orders.filter((order: any) => order.id !== orderId);
  }
}
