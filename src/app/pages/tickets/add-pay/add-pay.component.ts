import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TicketService } from '../../../services/ticket.service';
import { BoxesService } from '../../../services/boxes.service';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-pay',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './add-pay.component.html',
  styleUrl: './add-pay.component.scss'
})
export class AddPayComponent implements OnInit{
  addForm = this.formBuilder.group({
    id: [this.data.id, Validators.required],
    abonado: [0, Validators.required],
    type: ['', Validators.required]
  })

  box: any;
  types: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA ) public data: any, 
    private router: Router, 
    private dialogRef: MatDialogRef<AddPayComponent>,
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private productService: ProductsService
  ){}

  ngOnInit() {
    this.productService.getTypes()
    .subscribe((res:any) => {
      this.types = res;
    })
  }
  onSubmit()
  {
    const dat = {
      'id_client': this.data.id_client, 
      'type': this.addForm.value.type, 
      'amount': this.addForm.value.abonado
    };

    this.ticketService.addAbono(dat)
    .subscribe((res:any) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Abono agregado correctamente",
        showConfirmButton: false,
        timer: 1500
      });
      this.dialogRef.close();
    })
  }
}
