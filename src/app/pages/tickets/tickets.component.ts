import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TicketService } from '../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddPayComponent } from './add-pay/add-pay.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit{
  displayedColumns: string[] = ['subtotal', 'discount','total', 'date','options'];
  displayedColumnsAbonos: string[] = ['total', 'type', 'date'];
  dataSource: MatTableDataSource<any>;
  dataSourceAbonos: MatTableDataSource<any>;
  tickets: any = [];
  abonos:any = [];
  id_client: any;
  totalDeuda: any = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginatorAbono: MatPaginator;
  @ViewChild(MatSort) sortAbono: MatSort;

  constructor(private service: TicketService, private route: ActivatedRoute, public dialog: MatDialog) {

    
    

    
  }
  ngOnInit() {
    this.id_client = this.route.snapshot.paramMap.get('id');
    this.service.getTickets({'id_client': this.id_client}).subscribe((res:any) => {
      
      res.map((key: any) => {
        const difference = key.total - key.pagado;
        this.tickets.push({id: key.id, subtotal: key.subtotal, discount: key.discount, date: key.created_at, difference: difference, total: key.total})
      })
      this.dataSource = new MatTableDataSource(this.tickets);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.service.getAbonos({'id_client': this.id_client}).subscribe((res:any) => {
      res.abonos.map((key:any) =>{
        this.abonos.push({total: key.amount, type: key.type_name, date: key.created_at});
      })
      this.totalDeuda = res.adeudoTotal;
      this.dataSourceAbonos = new MatTableDataSource(this.abonos);
      this.dataSourceAbonos.paginator = this.paginatorAbono;
      this.dataSourceAbonos.sort = this.sortAbono;
    })

  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterAbono(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAbonos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAbonos.paginator) {
      this.dataSourceAbonos.paginator.firstPage();
    }
  }

  openDialog() {
    const dialog = this.dialog.open(AddPayComponent, {
      data: { id_client: this.id_client},
    });
    dialog.afterClosed().subscribe(() => {
      this.abonos = [];

      this.service.getAbonos({'id_client': this.id_client}).subscribe((res:any) => {
        this.totalDeuda = res.adeudoTotal;
        res.abonos.map((key:any) =>{
          this.abonos.push({total: key.amount, type: key.type_name, date: key.created_at});
        })
        this.dataSourceAbonos = new MatTableDataSource(this.abonos);
        this.dataSourceAbonos.paginator = this.paginatorAbono;
        this.dataSourceAbonos.sort = this.sortAbono;
      })
    });
  }


  delete(id:any)
  {

  
  }

}
