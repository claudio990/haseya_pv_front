import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../../services/categories.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  addForm = this.formBuilder.group({
    image: ['', Validators.required],
    name: ['', Validators.required],
  })

  files: any;
  reader: any;
  public loaded = true;
  constructor(private formBuilder: FormBuilder, private categories: CategoriesService, private router: Router){}

  onSubmit(){
    var formData = new FormData();
    formData.append('name', this.addForm.value.name!);
    formData.append('image', this.files);
    
    this.categories.addCategory(formData)
    .subscribe((res:any) =>  {
       if(res.status == 'success')
       {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Categoría Guardada",
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigateByUrl('/main/category')
       }
        
    });

  }

  filefn(event: Event){
    this.files = (event.target as HTMLInputElement).files![0];
  }
}
