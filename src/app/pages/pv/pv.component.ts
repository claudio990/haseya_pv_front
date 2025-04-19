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
  ticketActual : any = {};
  tickets: any = [];
  isOpenTicket : any = false;
  client: any = 'Venta General';

  paymentMethod: string = '';

  categories: any = [
  ];

  selectedCategory = this.categories[0];
  ticket: any[] = [];
  ticketGrouped: any[] = [];

  productsTicket: any[] = []; // Ya enviados (precargados desde backend)
  pendingItems: any[] = [];
  // total: number = 0;
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

      this.productService.getProductsBox({id_store: localStorage.getItem('id_store')})
      .subscribe({
        next: (data) => {
          this.categories = data;
          console.log(data);
          this.selectCategory(this.categories[0]);
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
      next: (data:any) => {
        this.ticketActual = data;
        this.isOpenTicket = true
        this.productsTicket = data.products
      }, 
      error:(e) => {

      }
    })

  }

  closeTicket()
  {
    this.ticketActual = {};
    this.isOpenTicket = false;
    this.pendingItems = [];
  }

  
  selectCategory(cat: any) {
    this.selectedCategory = cat;
  }

  
  get total() {
    const totalSent = this.productsTicket.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPending = this.pendingItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return totalSent + totalPending;
  }
  
  addToTicket(product: any) {
    const found = this.pendingItems.find(p => p.name === product.name);
    if (found) {
      found.quantity++;
    } else {
      
      this.pendingItems.push({ ...product, quantity: 1 });
    }
  }
  
  removeItem(item: any) {
    const index = this.pendingItems.findIndex(p => p.name === item.name);
    if (index > -1) {
      this.pendingItems.splice(index, 1);
    }
  }
  
  clearPending() {
    this.pendingItems = [];
  }
  
  sendOrder() {
    if (this.pendingItems.length === 0) {
      alert('No hay productos nuevos para enviar');
      return;
    }
  
    // Preparamos los datos para enviar
    const payload = this.pendingItems.map(item => ({
      id_product: item.code, // Asegúrate que cada producto tenga 'id'
      quantity: item.quantity,
      simple_price: item.cost,
      total: item.cost * item.quantity
    }));
    // Llamada al backend usando productService
    this.productService.addProductsToTicket(payload, this.ticketActual.id).subscribe({
      next: () => {
        // Fusionar a los productos ya enviados
        this.pendingItems.forEach(p => {
          const found = this.productsTicket.find(x => x.code === p.code);
          if (found) {
            found.quantity += p.quantity;
          } else {
            this.productsTicket.push({ ...p });
          }
        });
  
        this.pendingItems = [];
        alert('Comanda enviada con éxito');
      },
      error: () => {
        alert('Hubo un error al enviar la comanda');
      }
    });
  }

  getTotal(): number {
    const sent = this.productsTicket.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return sent;
  }
  
  chargeTicket() {
    if (!this.paymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }
  
    const payload = {
      id_ticket: this.id_ticket,
      method: this.paymentMethod,
      total: this.getTotal()
    };
  
    // this.productService.chargeTicket(payload).subscribe({
    //   next: () => {
    //     alert('Ticket cobrado correctamente');
    //     // Aquí podrías redirigir, cerrar modal, etc.
    //   },
    //   error: () => {
    //     alert('Error al cobrar el ticket');
    //   }
    // });
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
