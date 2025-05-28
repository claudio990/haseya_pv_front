import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../services/categories.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FinanzasService } from '../../services/finanzas.service';

@Component({
  selector: 'app-type-pay',
  standalone: true,
  imports: [
        MatFormFieldModule, 
        MatInputModule, 
        MatTableModule, 
        MatSortModule, 
        MatPaginatorModule, 
        MatButtonModule, 
        RouterModule
  ],
  templateUrl: './type-pay.component.html',
  styleUrl: './type-pay.component.scss'
})
export class TypePayComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'options'];
  dataSource: MatTableDataSource<any>;
  types: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: FinanzasService) {

    
    

    
  }
  ngOnInit() {
    
    this.loadingData()
  }

  loadingData(){
      this.service.getTypes().subscribe((res:any) => {
        this.types = res

        this.dataSource = new MatTableDataSource(this.types);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addTipoPago() {
    Swal.fire({
      title: 'Agregar tipo de pago',
      input: 'text',
      inputLabel: 'Nombre del tipo de pago',
      inputPlaceholder: 'Ej. Efectivo, Transferencia, etc.',
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Debes escribir un nombre válido';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const name = result.value.trim();

        this.service.addType({ name }).subscribe({
          next: () => {
            Swal.fire('¡Agregado!', 'El tipo de pago fue registrado correctamente.', 'success');
            this.loadingData()
          },
          error: () => {
            Swal.fire('Error', 'Hubo un problema al agregar el tipo de pago.', 'error');
          }
        });
      }
    });
  }

  editTipoPago(type: any) {
    Swal.fire({
      title: 'Editar tipo de pago',
      input: 'text',
      inputLabel: 'Nuevo nombre',
      inputValue: type.name,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Debes ingresar un nombre válido.';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newName = result.value.trim();

        this.service.editType({ id: type.id, name: newName }).subscribe({
          next: () => {
            Swal.fire('¡Actualizado!', 'El tipo de pago ha sido editado correctamente.', 'success');
            this.loadingData()
          },
          error: () => {
            Swal.fire('Error', 'Ocurrió un problema al editar el tipo de pago.', 'error');
          }
        });
      }
    });
  }



  delete(id:any)
  {

    Swal.fire({
      title: "Estas Seguro de eliminarlo?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteTypes({'id': id})
        .subscribe((res:any) => 
        {
          if(res.status == 'success')
          {
            Swal.fire({
              title: "Elminado!",
              text: "Tipo ha sido eliminada",
              icon: "success"
            });
            this.loadingData()
          }
        })
        
      }
    });
  }

}

