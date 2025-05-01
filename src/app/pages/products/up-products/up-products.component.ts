import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-up-products',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './up-products.component.html',
  styleUrl: './up-products.component.scss'
})
export class UpProductsComponent implements OnInit{
  displayedColumns: string[] = ['code', 'quantity', 'date'];
  dataSource: MatTableDataSource<any>;

  downs: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: ProductsService) {

  }
  ngOnInit() {
    console.log(localStorage.getItem('id_store'));
    
    this.service.ups({id_store: localStorage.getItem('id_store')}).subscribe((res:any) => {
      res.map((key: any) => {
        
        this.downs.push({ingredient: key.ingredient, quantity: key.quantity, date: key.created_at})
      })

      this.dataSource = new MatTableDataSource(this.downs);
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

  
  }

  back()
  {
    window.history.back()
  }

}
