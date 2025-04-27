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
        console.log('App estable, iniciando setInterval');
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

  loadCommands() {
    const id_store = localStorage.getItem('id_store');
    const timestamp = new Date().getTime(); // 👈 Para forzar petición nueva
  
    this.service.getCommands({ id_store, t: timestamp })
      .subscribe((res: any) => {
        console.log(res)
        const oldIds = this.orders.map(o => o.id);
        this.orders = res.map((order: any) => ({
          ...order,
          new: !oldIds.includes(order.id)
        }));
  
        setTimeout(() => {
          this.orders.forEach(order => order.new = false);
        }, 3000);
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
