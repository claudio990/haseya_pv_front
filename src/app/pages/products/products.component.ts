import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'products','category', 'cost', 'quantity',  'options'];
  dataSource: MatTableDataSource<any>;
  products: any;
  pr: any = [];
  id: any;
  line: any = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: ProductsService, private route: Router,  private router: ActivatedRoute) {

    
    

    
  }
  ngOnInit() {
    this.service.getProducts({'id' : this.id}).subscribe((res:any) => {
      this.products = res;
      this.products.map((key: any) => {
        this.pr.push({id: key.code, products: key.name, category: key.category, cost : key.cost, quantity: key.quantity})
      })

      this.dataSource = new MatTableDataSource(this.pr);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }
  
  ngAfterViewInit() {
   
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
      title: "Estas Seguro de eliminar el producto?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteProduct({'id': id})
        .subscribe((res:any) => 
        {
          if(res.status == 'success')
          {
            Swal.fire({
              title: "Elminado!",
              text: "Producto ha sido eliminado",
              icon: "success"
            });
           
            location.reload();
          }
        })
        
      }
    });
  //   
  }

}
