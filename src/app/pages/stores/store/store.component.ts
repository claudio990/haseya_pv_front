import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreServiceService } from '../../../services/store-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TicketService } from '../../../services/ticket.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    RouterModule
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit{

  id_store: any;

  store: any = {};
  stores: any = [];

  tickets: any = [];
  products: any = [];
  formData = new FormData();
  files: any; 
  displayedColumnsTickets: string[] = ['name', 'options'];
  dataSourceTickets: MatTableDataSource<any>;
  @ViewChild('ticketsPaginator') ticketsPaginator: MatPaginator;


  displayedColumnsProducts: string[] = ['name', 'options'];
  dataSourceProducts: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator: MatPaginator;


  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private storeService: StoreServiceService,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private productService: ProductsService
  ){}

  ngOnInit(): void {
    this.id_store = this.route.snapshot.paramMap.get('id');

    this.storeService.getStore({id: this.id_store})
    .subscribe((res:any) => {
      this.store = res;
    })

    this.getSells();
    this.getProducts();

  
  }

  getSells()
  {
    this.ticketService.getAllTickets().
    subscribe((res:any) => {
      this.tickets = res;


      this.dataSourceTickets = new MatTableDataSource(this.tickets);
      this.dataSourceTickets.paginator = this.ticketsPaginator;
      this.dataSourceTickets.sort = this.sort;
    })
  }

  getProducts()
  {
    this.productService.getProductStore()
    .subscribe((res:any) => {
      this.products = res;

      this.dataSourceProducts = new MatTableDataSource(this.products);
      this.dataSourceProducts.paginator = this.productsPaginator;
      this.dataSourceProducts.sort = this.sort;
    })
  }

  
  addStore() {
  
    Swal.fire({
      title: 'Añadir Tienda',
      input: 'text',
      inputPlaceholder: 'Ingrese el nombre de la tienda',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.storeService.addStore({ name: result.value })
        .subscribe((res:any) => {
          
        })
        Swal.fire('Éxito', 'Tienda añadida correctamente', 'success');
      }
    });
  }
  
    applyFilterTickets(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceTickets.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSourceTickets.paginator) {
          this.dataSourceTickets.paginator.firstPage();
        }
      }

    applyFilterProducts(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceProducts.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceProducts.paginator) {
        this.dataSourceProducts.paginator.firstPage();
      }
    }  
    

    addProduct() {
      // Reiniciamos formData cada vez que abrimos el modal
      this.formData = new FormData();
    
      Swal.fire({
        title: "Sube el Producto",
        html: `
          <label for="code">Código</label>
          <input id="code" class="swal2-input" placeholder="Código del Producto">

          <label for="name">Nombre</label>
          <input id="name" class="swal2-input" placeholder="Nombre del Producto">
          
          <label for="cost">Costo</label>
          <input id="cost" type="number" class="swal2-input" placeholder="Ingresa el costo">
          
          <label for="file">Sube la imagen</label>
          <input id="file" type="file" class="swal2-file">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Enviar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const codeInput = document.getElementById('code') as HTMLInputElement;
          const nameInput = document.getElementById('name') as HTMLInputElement;
          const costInput = document.getElementById('cost') as HTMLInputElement;
          const fileInput = document.getElementById('file') as HTMLInputElement;
    
          const code = codeInput?.value.trim();
          const name = nameInput?.value.trim();
          const cost = costInput?.value.trim();
          const file = fileInput?.files?.[0];
    
          if (!name || !cost || !file) {
            Swal.showValidationMessage('Por favor llena todos los campos.');
            return false;
          }
    
          // Añadimos los valores a formData
          this.formData.append('code', code);
          this.formData.append('name', name);
          this.formData.append('cost', cost);
          this.formData.append('file', file);
          this.formData.append('id_store', this.id_store);
    
          return { name, cost, file };
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.productService.addProduct(this.formData)
            .subscribe(
              (res: any) => {
                Swal.fire('¡Producto añadido!', 'El producto se ha subido exitosamente.', 'success');
              },
              (err: any) => {
                Swal.fire('Error', 'Hubo un problema al subir el producto.', 'error');
              }
            );
        }
      });
    }
    




      delete(id:any)
      {
    
        Swal.fire({
          title: "Estas Seguro de eliminar la tienda?",
          text: "No podrás revertir la acción!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, Eliminar!"
        }).then((result) => {
          if (result.isConfirmed) {
           
            
          }
        });
      }

}
