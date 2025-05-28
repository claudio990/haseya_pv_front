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

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}


@Component({
  selector: 'app-category',
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
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})

export class CategoryComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'options'];
  dataSource: MatTableDataSource<any>;
  categos: any;
  categories: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: CategoriesService) {

    
    

    
  }
  ngOnInit() {
    this.service.getCategories().subscribe((res:any) => {
      this.categos = res;
      console.log(res);
      
      
      this.categos.map((key: any) => {
        this.categories.push({id: key.id, name: key.name})
      })

      this.dataSource = new MatTableDataSource(this.categories);
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

  delete(id:any)
  {

    Swal.fire({
      title: "Estas Seguro de eliminar la categoría?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteCategory({'id': id})
        .subscribe((res:any) => 
        {
          if(res.status == 'success')
          {
            Swal.fire({
              title: "Elminado!",
              text: "Categoría ha sido eliminada",
              icon: "success"
            });
            window.location.reload();
          }
        })
        
      }
    });
  }

}
