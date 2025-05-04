import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { StoreServiceService } from '../../services/store-service.service';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

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
    RouterModule
  ],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit{

  stores: any = [];
  displayedColumns: string[] = ['name', 'options'];
  dataSource: MatTableDataSource<any>;
  tickets: any = [];
  idStore: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: StoreServiceService, 
    private serviceTicket: TicketService, 
    private route: ActivatedRoute
  ){}

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
      html: `
        <input type="text" id="storeName" class="swal2-input" placeholder="Nombre de la tienda">
        <input type="file" id="storeImage" class="swal2-file">
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('storeName') as HTMLInputElement).value;
        const imageFile = (document.getElementById('storeImage') as HTMLInputElement).files?.[0];
  
        if (!name) {
          Swal.showValidationMessage('Debe ingresar el nombre de la tienda');
          return;
        }
  
        const formData = new FormData();
        formData.append('name', name);
        if (imageFile) {
          formData.append('image', imageFile);
        }
  
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.service.addStore(result.value).subscribe((res: any) => {
          this.getStores();
          Swal.fire('Éxito', 'Tienda añadida correctamente', 'success');
        });
      }
    });
  }

  editStore(store: any) {
    Swal.fire({
      title: 'Editar Tienda',
      html: `
        <input type="text" id="storeName" class="swal2-input" placeholder="Nombre de la tienda" value="${store.name}">
        <input type="file" id="storeImage" class="swal2-file">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('storeName') as HTMLInputElement).value;
        const imageFile = (document.getElementById('storeImage') as HTMLInputElement).files?.[0];
  
        if (!name) {
          Swal.showValidationMessage('Debe ingresar un nombre');
          return;
        }
  
        const formData = new FormData();
        formData.append('id', store.id); // si es necesario en tu backend
        formData.append('name', name);
        if (imageFile) {
          formData.append('image', imageFile);
        }
  
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.service.editStore(result.value).subscribe((res: any) => {
          this.getStores();
          Swal.fire('Actualizado', 'Tienda actualizada correctamente', 'success');
        });
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
