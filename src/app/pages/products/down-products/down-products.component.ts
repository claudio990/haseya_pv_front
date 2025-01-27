import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-down-products',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './down-products.component.html',
  styleUrl: './down-products.component.scss'
})
export class DownProductsComponent  implements OnInit{
  displayedColumns: string[] = ['code', 'quantity', 'date'];
  dataSource: MatTableDataSource<any>;

  downs: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: ProductsService) {

    
    

    
  }
  ngOnInit() {
    this.service.downs().subscribe((res:any) => {
      console.log(res);
      
      res.map((key: any) => {
        
        this.downs.push({code: key.id_product, quantity: key.quantity, date: key.created_at})
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

}
