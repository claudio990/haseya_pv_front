import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../services/general.service';


@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {

  addForm = this.formBuilder.group({
    cellphone: ['', Validators.required],
    name: ['', Validators.required],
  })

  constructor(private formBuilder: FormBuilder, private clients: GeneralService, private router: Router){}

  onSubmit(){
    var formData = new FormData();
    formData.append('name', this.addForm.value.name!);
    formData.append('cellphone', this.addForm.value.cellphone!);

    console.log(formData);
    
    this.clients.addClient(this.addForm.value)
    .subscribe((res:any) =>  {
       if(res.status == 'success')
       {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cliente Guardado",
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigateByUrl('/main/client')
       }
        
    });

  }

}
