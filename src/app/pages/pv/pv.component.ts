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
  filteredOptions: any;
  filteredClient: any;
  products: any = [];
  total: any = 0;
  ELEMENT_DATA: any = [];
  formGroup: FormGroup;
  formClient: FormGroup;
  formStartBox: FormGroup;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total','accion'];
  clients: any = [];
  discountNumber: any = 0;
  types: any = [];
  selectedClient: any;
  selectedProudct: any;
  abonoClient: any = '';
  idBox: any;
  isOpenBox: boolean = false;
  id_employee: any = 0;
  today: any; 
  printTicket: boolean = false;
  id_ticket: any = 0;
  client: any = 'Venta General';

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
    })


    this.formGroup.get('producto')?.valueChanges.subscribe(value => {
      this.filteredOptions =  this._filter(value)
    })

    this.productService.getProducts({'id': 1})
    .subscribe({
      next: (data) => {
        this.options = data;
      }, 
      error:(e) => {

      }

    })
    this.formClient.get('client')?.valueChanges.subscribe(value => {
      this.filteredClient =  this.filterClients(value)
      
    })

    this.clientService.getClients()
    .subscribe({
      next: (data) =>{
        this.clients = data;
      },
      error:(e) => {

      }
    })
    

    this.productService.getTypes()
    .subscribe({
      next: (data) => {
        this.types = data;
      }, 
      error:(e) => {

      }
    })
  }

  private _filter(value: any): string[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.name.toLowerCase();
    return  this.options.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }

  private filterClients(value: any): string[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.name.toLowerCase();
      
    return  this.clients.filter((option:any) => option.name.toLowerCase().includes(filterValue));
  }

  displayProducto(producto: any): string {
    return producto.name;
  }

  displayClient(client: any): string {
    
    return client.name;
  }

  selected(event: any)
  {
    
    this.selectedProudct = event.option.value;
  }

  selectClient(event: any)
  {
    this.selectedClient = event.option.value;
    this.client = event.option.value.name;
    
    
  }

  discount(event: any)
  {

    this.discountNumber = event.target.value;
    
    this.totalPagar = this.totalPagarAntesDescuento - (this.totalPagarAntesDescuento * (this.discountNumber/100))
  }

  abono(event: any)
  {
    this.abonoClient = event.target.value;
    if(this.abonoClient != 0)
      {
        this.deshabilitado = false;

      }
      else{
        this.deshabilitado = true;
      }
  }



  addProduct()
  {
    const _cantidad: number = this.formGroup.value.cantidad;
    const _precio: number = parseFloat(this.selectedProudct.cost);
    const _total: number = _cantidad * _precio;
    this.totalPagarAntesDescuento = this.totalPagarAntesDescuento + _total;
    this.totalPagar = this.totalPagarAntesDescuento - (this.totalPagarAntesDescuento * (this.discountNumber/100))

   
    
    this.ELEMENT_DATA.push(
      {
        idProducto: this.selectedProudct.code,
        descripcionProducto: this.selectedProudct.name,
        cantidad: this.formGroup.value.cantidad,
        precioTexto: String(_precio.toFixed(2)),
        totalTexto: String(_total.toFixed(2))
      })
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

      this.formGroup.patchValue({
        producto: '',
        cantidad: ''
      })

  }

  eliminarProducto(item:any)
  {
    this.totalPagarAntesDescuento = this.totalPagarAntesDescuento - parseFloat(item.totalTexto);
    this.totalPagar = this.totalPagarAntesDescuento - (this.totalPagarAntesDescuento * (this.discountNumber/100))
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter((p:any) => p.idProducto != item.idProducto)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }
  registrarVenta() 
  {
    const id_client = this.formClient.value.client != '' ? this.formClient.value.client.id : 0
    this.client = this.formClient.value.client != '' ? this.formClient.value.client.name : 'Venta General'
    const amount = this.abonoClient != '' ? this.abonoClient : this.totalPagar

     
      const data = {'id_user': this.id_employee, 
                    'id_box': this.idBox, 
                    'subtotal': this.totalPagarAntesDescuento,
                    'discount': this.discountNumber,
                    'total': this.totalPagar,
                    'id_client' : id_client,
                    'type_pay' : this.tipodePago,
                    'amount_pay' : amount,
                    'is_abono' : 0
                   };
  
      this.ticketService.addTicket(data)
      .subscribe({
        next:(data: any) =>{
          if(data.status == 'success')
          {
            this.id_ticket = data.ticket_id;
            this.pdf();
            this.ELEMENT_DATA.map((key:any) => {
              const dat = {
                            'id_ticket': data.ticket_id,
                            'id_product': key.idProducto,
                            'simple_price': key.precioTexto,
                            'quantity': key.cantidad,
                            'total': key.totalTexto
                          
                          }
              this.ticketService.addProductTicket(dat)
              .subscribe((res:any)=>{})
            })
            setTimeout(() => {
              this.ELEMENT_DATA =[];
              this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
              this.totalPagar = 0;
              this.totalPagarAntesDescuento = 0;
              this.formGroup.patchValue({
                producto: '',
                cantidad: '',
                abono: '',
                discount: ''
              })
              this.formClient.patchValue({
                client: ''
              })
              this.discountNumber = 0;
              this.abonoClient = '';
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Ticket añadido correctamente",
                showConfirmButton: false,
                timer: 1500
              });
              }, 1500);
            
          }
        }
      })
    
      
      
    
    

  }

  abonar()
  {
    const id_client = this.formClient.value.client != '' ? this.formClient.value.client.id : 0
    const data = {'id_user': this.id_employee, 
                  'id_box': this.idBox, 
                  'subtotal': this.abonoClient,
                  'discount':0,
                  'total': this.abonoClient,
                  'id_client' : id_client,
                  'type_pay' : this.tipodePago,
                  'amount_pay' : this.abonoClient,
                  'is_abono' : 1
                  };


                  this.ticketService.addTicket(data)
                  .subscribe({
                    next:(data: any) =>{
                      if(data.status == 'success')
                      {
                        this.ELEMENT_DATA.map((key:any) => {
                          const dat = {
                                        'id_ticket': data.ticket_id,
                                        'id_product': key.idProducto,
                                        'simple_price': key.precioTexto,
                                        'quantity': key.cantidad,
                                        'total': key.totalTexto
                                      
                                      }
                          this.ticketService.addProductTicket(dat)
                          .subscribe((res:any)=>{})
                        })
                        this.ELEMENT_DATA =[];
                        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                        this.totalPagar = 0;
                        this.totalPagarAntesDescuento = 0;
                        this.formGroup.patchValue({
                          producto: '',
                          cantidad: '',
                          abono: '',
                          discount: ''
                        })
                        this.formClient.patchValue({
                          client: ''
                        })
                        this.discountNumber = 0;
                        this.abonoClient = '';
                        Swal.fire({
                          position: "top-end",
                          icon: "success",
                          title: "Abono añadido correctamente",
                          showConfirmButton: false,
                          timer: 1500
                        });
                      }
                    }
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
}
