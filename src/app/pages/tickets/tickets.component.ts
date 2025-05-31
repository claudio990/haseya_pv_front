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
  topProducts: any = [];
  id_box: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginatorAbono: MatPaginator;
  @ViewChild(MatSort) sortAbono: MatSort;


   //table for tickets
  displayedColumnsTickets: string[] = ['employee', 'total','method','start', 'end','options'];
  dataSourceTickets: MatTableDataSource<any>;
  @ViewChild('ticketsPaginator') ticketsPaginator: MatPaginator;


   //table for tickets
  displayedColumnsProducts: string[] = ['name', 'total','revenue', 'options'];
  dataSourceProducts: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator: MatPaginator;


  constructor(private service: TicketService, private route: ActivatedRoute, public dialog: MatDialog) {
    
  }
  ngOnInit() {
    this.id_box = this.route.snapshot.paramMap.get('id');
    this.getSells();
    this.getTopProducts();

  }

   getSells()
  {
    this.service.getBoxTickets({id_box : this.id_box}).
    subscribe((res:any) => {
      
      res.reverse();
      this.tickets = res;
      this.dataSourceTickets = new MatTableDataSource(this.tickets);
      this.dataSourceTickets.paginator = this.ticketsPaginator;
      this.dataSourceTickets.sort = this.sort;
    })
  }

  getTopProducts()
  {
    this.service.getTopSellingProductsByBox({id_box: this.id_box})
    .subscribe((res: any) => 
    {
      this.dataSourceProducts = new MatTableDataSource(res.top_products);
      this.dataSourceProducts.paginator = this.productsPaginator;
      this.dataSourceProducts.sort = this.sort;
    })
  }
  

  applyFilterTickets(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceTickets.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceTickets.paginator) {
        this.dataSourceTickets.paginator.firstPage();
      }
    }

  applyFilterProducts(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceProducts.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceProducts.paginator) {
        this.dataSourceProducts.paginator.firstPage();
      }
    }

}
