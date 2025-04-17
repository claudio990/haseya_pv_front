import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list'
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { GeneralService } from '../../services/general.service';
import { TicketService } from '../../services/ticket.service';
import Swal from 'sweetalert2';
import { CloseBoxComponent } from './close-box/close-box.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-pv',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule, 
    MatButtonModule,
    MatGridListModule,
    AsyncPipe,
    CommonModule,
    RouterModule
  ],
  templateUrl: './pv.component.html',
  styleUrl: './pv.component.scss'
})
export class PvComponent {
  deshabilitado: boolean = true;
  tipodePago: number = 1;
  totalPagar: number = 0;
  totalPagarAntesDescuento: number = 0;
  myControl = new FormControl('');
  options: any = [];
  products: any = [];
  ELEMENT_DATA: any = [];
  formGroup: FormGroup;
  formClient: FormGroup;
  formStartBox: FormGroup;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total','accion'];
  selectedProudct: any;
  abonoClient: any = '';
  idBox: any;
  isOpenBox: boolean = false;
  id_employee: any = 0;
  today: any; 
  id_ticket: any = 0;
  ticketss : any = {};
  tickets: any = [];
  isOpenTicket : any = false;
  client: any = 'Venta General';


  categories = [
    {
      name: 'Bebidas',
      products: [
        { name: 'Coca-Cola', price: 20, image: 'assets/coca.jpg' },
        { name: 'Agua', price: 15, image: 'assets/agua.jpg' }
      ]
    },
    {
      name: 'Snacks',
      products: [
        { name: 'Papas', price: 25, image: 'assets/papas.jpg' },
        { name: 'Chocolates', price: 30, image: 'assets/chocolate.jpg' }
      ]
    }
  ];

  selectedCategory = this.categories[0];
  ticket: any[] = [];
  ticketGrouped: any[] = [];
  total: number = 0;
  constructor(private fb: FormBuilder, 
              private productService: ProductsService, 
              private clientService: GeneralService,
              private ticketService:TicketService,
              public dialog: MatDialog
              )
  {

    this.formStartBox = this.fb.group({
      moneyStarted : [0, Validators.required]
    })

    this.formGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      abono: [''],
      discount: ['']
    })

    this.formClient = this.fb.group({
      client: ['']
    })
  
  }

  bandWaiter: boolean = false;

  ngOnInit() {
    this.selectCategory(this.categories[0]);
    
    const type = localStorage.getItem('user')
    this.bandWaiter = type == 'waiter' ? true : false;
    this.today = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.today = this.today.toLocaleDateString('es-Mx', options);

    this.id_employee = localStorage.getItem('id_user');

    this.ticketService.validationBox({'id_employee': 0})
    .subscribe((res:any) =>{
      this.isOpenBox = res.isOpen == 1 ? true : false;
      this.idBox = this.isOpenBox ? res.id_box : ''
      this.ticketService.getTicketsBox({id_box: this.idBox})
      .subscribe({
        next: (data) => {
          this.tickets = data;
          
        }, 
        error:(e) => {
  
        }
      })
    })

    
  }

  onSubmit()
  {
    const data = {moneyStarted: this.formStartBox.value.moneyStarted, id_store: localStorage.getItem('id_store')}
    this.ticketService.addBox(data)
    .subscribe((res:any) =>
    {
      if(res.status == 'success')
      {
        this.isOpenBox = true;
        this.idBox = res.box_id;
      }
    })
  }

  openDialog() {
    const dialog = this.dialog.open(CloseBoxComponent, {
      data: { id: this.idBox},
    });
   
  }

  openTicket(id:any)
  {
    this.ticketService.getTicket({id: id})
    .subscribe({
      next: (data) => {
        // this.ticket = data;
        this.isOpenTicket = true
        
      }, 
      error:(e) => {

      }
    })

  }

  
  selectCategory(cat: any) {
    this.selectedCategory = cat;
  }

  addToTicket(product: any) {
    this.ticket.push(product);
    this.groupTicket();
  }

  removeItem(item: any) {
    const index = this.ticket.findIndex(p => p.name === item.name);
    if (index > -1) {
      this.ticket.splice(index, 1);
      this.groupTicket();
    }
  }

  clearTicket() {
    this.ticket = [];
    this.ticketGrouped = [];
    this.total = 0;
  }

  groupTicket() {
    const grouped = this.ticket.reduce((acc, product) => {
      const found = acc.find((p:any) => p.name === product.name);
      if (found) {
        found.quantity++;
      } else {
        acc.push({ ...product, quantity: 1 });
      }
      return acc;
    }, [] as any[]);

    this.ticketGrouped = grouped;
    this.total = this.ticket.reduce((sum, p) => sum + p.price, 0);
  }


  // pdf()
  // {
  //   this.printTicket = true;
  //   setTimeout(() => {
  //     let pdf = new jsPDF('p', 'pt', [612, 792]);
  //   const data = document.getElementById('ticket') as HTMLElement;
  //   pdf.html(data, {
  //       callback: function () {
  //         // pdf.save('test.pdf');
  //         window.open(pdf.output('bloburl')); // to debug
  //       },
  //       // margin: [60, 60, 60, 60],
  //       // x: 32,
  //       // y: 32,
  //     });
  //   }, 1000);

  //   setTimeout(() => {
  //     this.printTicket = false;
  //   }, 1500);
    
  // }
}
