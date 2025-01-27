import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-see-inventory',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './see-inventory.component.html',
  styleUrl: './see-inventory.component.scss'
})
export class SeeInventoryComponent implements OnInit{

  //Table for inventory no finished

  displayedColumns: string[] = ['id', 'name', 'quantity'];
  dataSource: MatTableDataSource<any>;
  dataFinSource:MatTableDataSource<any>;

  //Table for inventory finished
  displayedColumns2: string[] = ['id', 'name', 'inventory', 'ingresed', 'difference'];
  dataSource2: MatTableDataSource<any>;
  dataFinSource2:MatTableDataSource<any>;




  inventories: any = [];
  favor: any = 0;
  contra: any = 0;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  id:any;
  inventory: any = {};
  constructor(private serviceInventory: InventoryService, private route: ActivatedRoute){ }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.serviceInventory.getInventory({'id': this.id})
    .subscribe((res: any) =>{
      this.inventory = res;
      this.dataSource = new MatTableDataSource(this.inventory.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource2 = new MatTableDataSource(this.inventory.products);
      this.dataSource2.paginator = this.paginator;
      this.dataSource2.sort = this.sort;

      res.products.map((key: any) =>{
        console.log('heloo : ' + Math.sign(key.difference));
        
        if(Math.sign(key.difference) == 1)
        {
          this.contra = this.contra + key.difference
        }
        else
        {
          this.favor = this.favor + (key.difference * -1)
        }
      })
      
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  

  updateQuantity(event:any, id_product:any, inventory:any)
  {
    const ingresed = event.target.value;

    var difference = inventory - ingresed;
    var obj = {'id_inventory': this.id, 'id_product': id_product, 'ingresed': ingresed, 'difference': difference};

    
    this.serviceInventory.updateInventory(obj)
    .subscribe((res:any) =>{
      console.log(res);
      
    })
    
  }

  finish()
  {
    Swal.fire({
      title: "Estas Seguro de finalizar el inventario?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceInventory.finishInventory({'id': this.id})
        .subscribe((res:any) => 
        {
          if(res.status == 'success')
          {
            Swal.fire({
              title: "Finalizado!",
              text: "El inventario ha sido Finalizado correctamente",
              icon: "success"
            });
            window.location.reload();
          }
        })
        
      }
    });
  }
}
