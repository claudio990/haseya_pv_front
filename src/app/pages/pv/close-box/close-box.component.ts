import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { TicketService } from '../../../services/ticket.service';
import { BoxesService } from '../../../services/boxes.service';
@Component({
  selector: 'app-close-box',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './close-box.component.html',
  styleUrl: './close-box.component.scss'
})
export class CloseBoxComponent implements OnInit{

  addForm = this.formBuilder.group({
    id: [this.data.id, Validators.required],
    money_ingresed: [0, Validators.required],
    money_difference: ['', Validators.required]
  })

  box: any;

  constructor(
    @Inject(MAT_DIALOG_DATA ) public data: any, 
    private router: Router, 
    private dialogRef: MatDialogRef<CloseBoxComponent>,
    private formBuilder: FormBuilder,
    private ticketService: TicketService,
    private boxService: BoxesService
  ){}

  ngOnInit() {
    this.boxService.getBox({id: this.data.id})
    .subscribe((res:any) => {
      this.box = res;
      console.log(res);
      
    })
  }
  onSubmit()
  {
    var difference = this.box.money_started - this.addForm.value.money_ingresed!;
    const dataBox = {
                      'ingresed' : this.addForm.value.money_ingresed, 
                      'difference' : difference,
                      'id' : this.data.id
                    };
    
    this.boxService.closeBox(dataBox)
    .subscribe((res:any) =>{
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Caja cerrada con éxito",
        showConfirmButton: false,
        timer: 1500
      });
      location.reload();
    })
  }
}
