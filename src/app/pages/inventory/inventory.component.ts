import {Component, OnInit, ViewChild, LOCALE_ID} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule,
     MatPaginatorModule,
      MatButtonModule, 
      RouterModule, 
      CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'finished' ,'date','options'];
  dataSource: MatTableDataSource<any>;
  inventories: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: InventoryService, public dialog: MatDialog ) {

    
    

    
  }
  ngOnInit() {
    this.service.getInventories().subscribe((res:any) => {
      this.inventories = res;
      this.dataSource = new MatTableDataSource(this.inventories);
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

  openDialog() {
    const dialog = this.dialog.open(AddInventoryComponent, {
      data: { id: 2},
    });
    dialog.afterClosed().subscribe(() => {
      // this.productService.getImages({id: this.id})
      // .subscribe((res:any) =>
      // {
      //   this.images = [];
      //   res.map((image:any) => {
      //     const src = 'http://localhost:8000/storage/images/products/' + image.image;
      //     const album = {
      //       src: src, 
      //       id: image.id
      //     }
  
      //     this.images.push(album);
      //   })
      // })
      
    });
  }

  delete(id:any)
  {

    // Swal.fire({
    //   title: "Estas Seguro de eliminar la categoría?",
    //   text: "No podrás revertir la acción!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Si, Eliminar!"
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.service.deleteCategory({'id': id})
    //     .subscribe((res:any) => 
    //     {
    //       if(res.status == 'success')
    //       {
    //         Swal.fire({
    //           title: "Elminado!",
    //           text: "Categoría ha sido eliminada",
    //           icon: "success"
    //         });
    //         window.location.reload();
    //       }
    //     })
        
    //   }
    // });
  }
}
