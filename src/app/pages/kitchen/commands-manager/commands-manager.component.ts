import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import Swal from 'sweetalert2';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-commands-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commands-manager.component.html',
  styleUrl: './commands-manager.component.scss'
})
export class CommandsManagerComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  intervalId: any;
  appRef = inject(ApplicationRef);

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
    this.loadCommands(); // Primera carga

    // Esperar que Angular esté estable
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
   getNoteForComensal(order:any, comensal: number): string | undefined {
    // Primero, verifica si la orden tiene un array de notas.
    // Luego, busca la nota cuyo 'comensal' coincida.
    const noteEntry = order.notes?.find((note: any) => note.comensal === comensal);
    return noteEntry ? noteEntry.note : undefined; // Retorna la nota o undefined si no la encuentra
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
  
    });
  }
  
  isNewOrder(order: any): boolean {
    return Date.now() - order.createdAt < 15000; // 15s
  }
  

  deleteCommand(orderId: number) {
    Swal.fire({
      title: "¿Seguro que deseas eliminar esta comanda?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteCommand({ id: orderId })
          .subscribe(() => {
            Swal.fire({
              title: "¡Enviado!",
              text: "Se ha eliminado con éxito.",
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