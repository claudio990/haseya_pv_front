import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TicketService } from '../../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { AddPayComponent } from '../add-pay/add-pay.component';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-see-ticket',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './see-ticket.component.html',
  styleUrl: './see-ticket.component.scss'
})
export class SeeTicketComponent implements OnInit{
  displayedColumns: string[] = ['amount', 'type','date'];
  displayedColumnsProducts: string[] = ['name', 'quantity','simple_price', 'total'];
  dataSource: MatTableDataSource<any>;
  dataSourceProducts: MatTableDataSource<any>;
  tickets: any = [];
  id_ticket: any;
  productsTicket: any = [];
  totalDeuda: any = 0;
  printTicket: boolean = false;
  today:any;
  client:any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginatorProducts: MatPaginator;
  @ViewChild(MatSort) sortProducts: MatSort;
  ticket: any = {};
  constructor(private service: TicketService, private route: ActivatedRoute,  public dialog: MatDialog, public generalService: GeneralService) {
  }
  ngOnInit() {
    this.today = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.today = this.today.toLocaleDateString('es-Mx', options);

    this.id_ticket = this.route.snapshot.paramMap.get('id');
    this.service.getTicket({'id': this.id_ticket}).subscribe((res:any) => {
      this.ticket = res;
      

      res.products.map((key:any) =>{
        this.productsTicket.push({name: key.name, quantity: key.quantity, simple: key.simple_price, total: key.total})
      })

      this.dataSource = new MatTableDataSource(this.productsTicket);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceProducts = new MatTableDataSource(this.productsTicket);
      this.dataSourceProducts.paginator = this.paginatorProducts;
      this.dataSourceProducts.sort = this.sortProducts;
    })

    // setTimeout(() => {
    //   this.generalService.getClient({'id': this.ticket.id_client})
    //   .subscribe((res:any) =>{
    //     this.client = res;
    //   })
      
    // }, 1000);

  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }

  openDialog() {
    const dialog = this.dialog.open(AddPayComponent, {
      data: { id: this.id_ticket, id_client: this.ticket.id_client},
    });
    dialog.afterClosed().subscribe(() => {
      this.ticket = '';
      this.tickets = [];
      this.service.getTicket({'id': this.id_ticket}).subscribe((res:any) => {
        this.ticket = res;
        res.pays.map((key: any) => {
          this.totalDeuda = res.adeudo;
          this.tickets.push({amount: key.amount, type: key.tipo, date: key.created_at})
        })
        this.dataSource = new MatTableDataSource(this.tickets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    });
   
  }


  pdf()
  {
    this.printTicket = true;
    setTimeout(() => {
      let pdf = new jsPDF('p', 'pt', [612, 792]);
    const data = document.getElementById('ticket') as HTMLElement;
    pdf.html(data, {
        callback: function () {
          // pdf.save('test.pdf');
          window.open(pdf.output('bloburl')); // to debug
        },
        // margin: [60, 60, 60, 60],
        // x: 32,
        // y: 32,
      });
    }, 1000);

    setTimeout(() => {
      this.printTicket = false;
    }, 1500);
    
  }

  back()
  {
    window.history.back()
  }
}
