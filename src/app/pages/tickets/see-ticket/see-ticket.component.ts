import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import { StoreServiceService } from '../../../services/store-service.service';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import { environment } from '../../../../environments/environment.development';

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
  // printTicket: boolean = false;
  today:any;
  client:any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginatorProducts: MatPaginator;
  @ViewChild(MatSort) sortProducts: MatSort;
  // variables para ticket
    @ViewChild('ticketRef') ticketRef!: ElementRef;
    showTicket = false;
    currentDate = new Date();
    logoBase64: any;
    store: any;
    bandprintTicket : boolean = false;
  ticket: any = {};
  constructor(private service: TicketService, 
            private storeService: StoreServiceService,
    private route: ActivatedRoute, 
    private http: HttpClient,
     public dialog: MatDialog, 
     public  generalService: GeneralService) {
  }
  ngOnInit() {
    this.storeService.getStore({id: localStorage.getItem('id_store')})
    .subscribe((res: any) => {
      this.store = res
      let token = localStorage.getItem('token')
      this.http.get(environment.url_api + this.store.image, {
        responseType: 'text',
        headers: {
          Authorization: `Bearer ${token}` // debes obtener este token del sistema de auth
        }
      }).subscribe(base64 => {
        this.logoBase64 = base64;
      });
    })



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
  
  getComensalesFromTicket(): number[] {
      const comensales = (this.ticket?.products || [])
        .map((p:any) => Number(p.comensal))
        .filter((c:any) => !isNaN(c)) as number[];

      return [...new Set(comensales)].sort((a, b) => a - b);
    }

    getProductosPorComensal(comensal: number): any[] {
    return (this.ticket?.products || []).filter((p:any) => p.comensal === comensal);
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


  printTicket() {
    this.bandprintTicket = true;
    const ticketElement = document.getElementById('ticket');
    if (!ticketElement) return;
  
    html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 2000
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
  
      const pxToMm = 0.264583;
      const pdfWidth = 80; // mm
      const pdfHeight = canvas.height * pxToMm;
  
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight],
      });
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      // Imprimir directo sin abrir PDF
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
  
      const printWindow = window.open(blobUrl);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          this.bandprintTicket = true;
        };
      }
    });
  }
  

  back()
  {
    window.history.back()
  }
}
