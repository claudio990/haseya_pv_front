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
  displayedColumns: string[] = ['name', 'options'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private storeService: StoreServiceService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.id_store = this.route.snapshot.paramMap.get('id');

    this.storeService.getStore({id: this.id_store})
    .subscribe((res:any) => {
      this.store = res;
      console.log(res);
      
    })
  }

   getStores()
    {
      this.storeService.getStores()
      .subscribe((res:any) => {
        this.stores = res;
  
        this.dataSource = new MatTableDataSource(this.stores);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
            this.getStores()
          })
          Swal.fire('Éxito', 'Tienda añadida correctamente', 'success');
        }
      });
    }
  
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
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
