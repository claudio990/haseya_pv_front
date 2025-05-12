import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ProductsService } from '../../services/products.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list'
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { TicketService } from '../../services/ticket.service';
import Swal from 'sweetalert2';
import { CloseBoxComponent } from './close-box/close-box.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { jsPDF } from "jspdf";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { StoreServiceService } from '../../services/store-service.service';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pv',
  standalone: true,
  imports: [
    MatTabsModule,
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
    MatPaginatorModule, 
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
  peopleCount: number = 1;
  toGo: any = false;
  clientName: string = '';
  categories: any = [
  ];
  isLoading: boolean = false;
  selectedCategory = this.categories[0];
  ticket: any[] = [];
  ticketGrouped: any[] = [];

  // variables para ticket
  @ViewChild('ticketRef') ticketRef!: ElementRef;
  showTicket = false;
  currentDate = new Date();

  //table for tickets
  displayedColumnsTickets: string[] = ['employee', 'total','method','start', 'end','options'];
  dataSourceTickets: MatTableDataSource<any>;
  @ViewChild('ticketsPaginator') ticketsPaginator: MatPaginator;
  
  @ViewChild(MatSort) sort: MatSort;
  productsTicket: any[] = []; // Ya enviados (precargados desde backend)
  pendingItems: any[] = [];
  paymentMethod: string = 'efectivo';
  amountReceived: number = 0;
  showPaymentForm: boolean = false;
  coupons: any = [];
  bandDiscount: number = 0;
  id_store: any;
  logoBase64: any;
  // total: number = 0;
  constructor(private fb: FormBuilder, 
              private productService: ProductsService, 
              private storeService: StoreServiceService,
              private ticketService:TicketService,
              public dialog: MatDialog,
              private http: HttpClient
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

  store: any = {};

  bandWaiter: boolean = false;

  ngOnInit() {
    
    this.isLoading = true; // activa loading
    
    const type = localStorage.getItem('user')
    this.bandWaiter = type == 'waiter' ? true : false;
    this.today = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.today = this.today.toLocaleDateString('es-Mx', options);
    this.id_store = localStorage.getItem('id_store');
    this.id_employee = localStorage.getItem('id_user');
    this.storeService.getStore({id: this.id_store})
    .subscribe((res: any) => {
      this.store = res
    })
    this.ticketService.validationBox({'id_store': this.id_store})
    .subscribe((res:any) =>{
      this.isOpenBox = res.isOpen == 1 ? true : false;
      this.idBox = this.isOpenBox ? res.id_box : ''
      this.getTables();
      this.getSells();
      this.getCoupons();

      

      this.productService.getProductsBox({id_store: localStorage.getItem('id_store')})
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.selectCategory(this.categories[0]);
        }, 
        error:(e) => {
  
        }
      })
    })
    
    this.isLoading = false; // desactiva loading


    
  }

  getSells()
  {
    this.ticketService.getAllTickets({id_store: this.id_store}).
    subscribe((res:any) => {
      
      res.reverse();
      this.dataSourceTickets = new MatTableDataSource(res);
      this.dataSourceTickets.paginator = this.ticketsPaginator;
      this.dataSourceTickets.sort = this.sort;
    })
  }


  applyFilterTickets(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTickets.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTickets.paginator) {
      this.dataSourceTickets.paginator.firstPage();
    }
  }

  getCoupons()
  {
    this.ticketService.getCoupons({id_store: localStorage.getItem('id_store')})
    .subscribe((res: any) => {
      this.coupons = res;
    })
  }

  getTables()
  {
    this.ticketService.getTicketsBox({id_box: this.idBox, id_user: this.id_employee})
    .subscribe({
      next: (data : any) => {
        this.tickets = data.open;
      }, 
      error:(e) => {

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

  addTicket(name: string, count: number, toGo: any) {
    this.isLoading = true; // activa loading
    
    const data = {
      name: name,
      quantity: count,
      id_user: localStorage.getItem('id_user'),
      id_box: this.idBox,
      toGo: toGo ? 1 : 0
    };
  
    this.ticketService.addTicket(data).subscribe({
      next: (res: any) => {
        this.openTicket(res.ticket_id);
        this.isLoading = false; // desactiva loading
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Error al abrir la mesa');
      }
    });
  }

  openDialog() {
    const dialog = this.dialog.open(CloseBoxComponent, {
      data: { id: this.idBox},
    });
   
  }

  openTicket(id:any)
  {
    
    this.isLoading = true; // activa loading
    this.ticketService.getTicket({id: id})
    .subscribe({
      next: (data:any) => {
        this.ticketActual = data;
        this.isOpenTicket = true
        this.productsTicket = data.products
        this.isLoading = false; // desactiva loading
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
    this.showTicket = false;
    
    this.getSells();
    this.getTables();
  }

  
  selectCategory(cat: any) {
    this.selectedCategory = cat;
  }

  
  get total() {
    const totalSent = this.productsTicket.reduce((acc, item) => acc + item.total, 0);
    const totalPending = this.pendingItems.reduce((acc, item) => acc + item.cost * item.quantity, 0);

    return totalSent + totalPending;
  }

  discountVerify(event: any)
  {
    const discount = event.target.value;
    
    const band = this.coupons.find((coupon: any) => coupon.name === discount)
    if(discount === '')
    {
      
      this.bandDiscount = 0;
    }  
    else if(band != undefined )
    {
      
      this.bandDiscount = band.quantity > 0 ? 1 : 2;
    }
    else
    {
      this.bandDiscount = 2;
    }

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

    if(item.quantity > 1 )
    {
      item.quantity = item.quantity - 1 
    }
    else if (index > -1) {
      this.pendingItems.splice(index, 1);
    }
  }
  
  clearPending() {
    this.pendingItems = [];
  }
  
  sendOrder() {
    if (this.pendingItems.length === 0) {
      Swal.fire('No hay productos nuevos para enviar');
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
    this.productService.addProductsToTicket(payload, this.ticketActual.id, localStorage.getItem('id_store')).subscribe({
      next: () => {
        // Fusionar a los productos ya enviados
        this.pendingItems.forEach(p => {
          const found = this.productsTicket.find(x => x.code === p.code);
          if (found) {
            found.quantity += p.quantity;
            found.total += p.cost * p.quantity; // también actualizas el total si ya existe
          } else {
            this.productsTicket.push({ 
              ...p,
              total: p.cost * p.quantity
            });
          }
        });
        
        this.pendingItems = [];
        
        Swal.fire('Comanda Enviada');
      },
      error: () => {
        Swal.fire('Hubo un error al enviar la comanda')
      }
    });
  }

  getTotal(): number {
    const sent = this.productsTicket.reduce((acc, item) => acc + item.total, 0);

    
    return sent;
  }
  

  startPayment()
  {
    this.showPaymentForm = true;

  }

  chargeTicket() {
    if (!this.paymentMethod) {
      Swal.fire('Selecciona un método de pago')
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
  

  
  payTicket() {
    const paymentData = {
      id: this.ticketActual.id,
      method: this.paymentMethod,
      discount: 0,
      subtotal: this.total,
      total: this.total,
      id_box: this.idBox
    };
  
    this.ticketService.payTicket(paymentData).subscribe({
      next: (res: any) => {
        Swal.fire('Pago exitoso');
        // this.closeTicket();
        this.showPaymentForm = false;
        // this.getTables();
        // this.getSells();
        let token = localStorage.getItem('token')
        this.http.get('http://127.0.0.1:8000/api/logo-base64/' + this.store.image, {
          responseType: 'text',
          headers: {
            Authorization: `Bearer ${token}` // debes obtener este token del sistema de auth
          }
        }).subscribe(base64 => {
          this.logoBase64 = base64;
        });
  
        // Mostrar ticket y permitir impresión/WhatsApp
        this.showTicket = true;
        this.currentDate = new Date();
      },
      error: () => {
        Swal.fire('Error al cobrar');
      }
    });
  }
  

  
  printTicket() {
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
        };
      }
    });
  }
  

  useFallback(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...'; // <- imagen base64 mínima o logo por defecto
  }
  
  
  
  sendTicketWhatsapp() {
    Swal.fire({
      title: 'Enviar por WhatsApp',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Número (10 dígitos)" type="tel">',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement)?.value;
        const number = (document.getElementById('swal-input2') as HTMLInputElement)?.value;
        if (!name || !number || number.length !== 10) {
          Swal.showValidationMessage('Nombre y número válidos son requeridos');
          return;
        }
        return { name, number };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { name, number } = result.value;
  
        // 👉 Llama a tu servicio para guardar el contacto
        this.ticketService.saveWhatsappContact({
          name: name,
          phone: number
        }).subscribe({
          next: () => {
            // 🧾 Construir ticket completo en texto
            const lines = this.ticketActual.products.map((p: any) => `${p.quantity} x ${p.name} - $${p.total}`).join('\n');
            const ticketText = `🍽 ${this.store.name}\nTicket: ${this.ticketActual?.id}\nCliente: ${name}\n\n${lines}\n\nTotal: $${this.total}\nGracias por su compra.`;
            const encoded = encodeURIComponent(ticketText);
            const waUrl = `https://wa.me/52${number}?text=${encoded}`;
            window.open(waUrl, '_blank');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo guardar el número en la base de datos.', 'error');
          }
        });
      }
    });
  }
  
  cancelPayment() {
    this.showPaymentForm = false;
  }


  // pdf()
  // {
  //   this.printTicket = true;
  //   setTimeout(() => {
  //     let pdf = new jsPDF('p', 'pt', [612, 792]);
  //   const data = document.getElementById('ticket') as HTMLElement;
  //   pdf.html(data, {
  //       callback: function () {
  //         pdf.save('test.pdf');
  //         window.open(pdf.output('bloburl')); // to debug
  //       },
  //       margin: [60, 60, 60, 60],
  //       x: 32,
  //       y: 32,
  //     });
  //   }, 1000);

  //   setTimeout(() => {
  //     this.printTicket = false;
  //   }, 1500);
    
  // }
}
