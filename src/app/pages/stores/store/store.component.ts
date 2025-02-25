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
    

    addProduct()
    {
      Swal.fire({
        title: "Submit your information",
        html: `
          <label for="github-username">Github username</label>
          <input id="github-username" class="swal2-input" placeholder="Enter Github username">
          
          <label for="email">Email</label>
          <input id="email" type="email" class="swal2-input" placeholder="Enter your email">
          
          <label for="file">Upload file</label>
          <input id="file" type="file" class="swal2-file">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Look up",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const usernameInput = document.getElementById('github-username') as HTMLInputElement;
          const emailInput = document.getElementById('email') as HTMLInputElement;
          const fileInput = document.getElementById('file') as HTMLInputElement;
      
          const username = usernameInput?.value.trim();
          const email = emailInput?.value.trim();
          const file = fileInput?.files?.[0];
      
          if (!username || !email || !file) {
            Swal.showValidationMessage('Please fill in all fields');
            return false;
          }
      
          try {
            const githubUrl = `https://api.github.com/users/${username}`;
            const response = await fetch(githubUrl);
            if (!response.ok) {
              return Swal.showValidationMessage(`
                ${JSON.stringify(await response.json())}
              `);
            }
            return { ...(await response.json()), email, file };
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: `${result.value.login}'s avatar`,
            text: `Email: ${result.value.email}`,
            imageUrl: result.value.avatar_url
          });
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
