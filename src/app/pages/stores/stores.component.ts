import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { StoreServiceService } from '../../services/store-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    RouterModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit{

  stores: any = [];
  displayedColumns: string[] = ['name', 'options'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: StoreServiceService){}

  ngOnInit(): void {
   this.getStores()

  }

  getStores()
  {
    this.service.getStores()
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
        this.service.addStore({ name: result.value })
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
          this.service.deleteStore({'id': id})
          .subscribe((res:any) => 
          {
            if(res.status == 'success')
            {
              Swal.fire({
                title: "Elminado!",
                text: "Tienda ha sido eliminada",
                icon: "success"
              });
              this.getStores()
            }
          })
          
        }
      });
    }
}
