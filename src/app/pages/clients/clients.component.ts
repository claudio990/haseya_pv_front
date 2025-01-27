import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../services/categories.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { GeneralService } from '../../services/general.service';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit{
  displayedColumns: string[] = ['name','cellphone', 'deuda', 'options'];
  dataSource: MatTableDataSource<any>;
  
  clients: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: GeneralService){}

  ngOnInit(): void {
    this.service.getClients()
    .subscribe((res: any) => {
      res.map((key:any) => {
        const deuda = key.mountAcumulate - key.payed
        this.clients.push({id: key.id,name: key.name,deuda: deuda, cellphone: key.cellphone})
      })

      this.dataSource = new MatTableDataSource(this.clients);
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

  delete(id: any)
  {
    Swal.fire({
      title: "Estas Seguro de eliminar el cliente?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteClient({'id': id})
        .subscribe((res:any) => 
        {
          if(res.status == 'success')
          {
            Swal.fire({
              title: "Elminado!",
              text: "Cliente ha sido eliminada",
              icon: "success"
            });
            window.location.reload();
          }
        })
        
      }
    });
  }
}
