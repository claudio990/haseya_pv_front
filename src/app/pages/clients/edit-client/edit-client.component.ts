import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import {MatButtonModule} from '@angular/material/button';

import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../services/general.service';



@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss'
})
export class EditClientComponent implements OnInit{
  
  files : any;

  info : any ={};
  id: any;

  addForm = this.formBuilder.group({
    cellphone: ['', Validators.required],
    name: ['', Validators.required],
  })
  constructor(
    private formBuilder: FormBuilder, 
    private service: GeneralService, 
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit()
  {
     this.id = this.route.snapshot.paramMap.get('id');

    this.service.getClient({'id': this.id})
    .subscribe((res:any) =>
    {
      this.info = res;
      this.addForm.controls['name'].setValue(res.name);
      this.addForm.controls['cellphone'].setValue(res.cellphone);
    })
  }

  
  onSubmit()
  {
    this.service.editClient({'id': this.id, 'name': this.addForm.value.name, 'cellphone': this.addForm.value.cellphone})
    .subscribe((res:any) => {
      if(res.status == 'success')
      {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Cliente Editado",
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigateByUrl('/main/client')
      }
    })
    

    
    
  }

  filefn(event: Event)
  {
    this.files = (event.target as HTMLInputElement).files![0];
  }
}
