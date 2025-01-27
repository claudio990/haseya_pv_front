import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../../services/categories.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  addForm = this.formBuilder.group({
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  files: any;
  reader: any;
  public loaded = true;
  constructor(private formBuilder: FormBuilder, private service: UserService, private router: Router){}

  onSubmit(){
    this.service.registerEmployee(this.addForm.value)
    .subscribe((res:any) =>  {
      
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Empleado Guardada",
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigateByUrl('/main/employees')
       
        
    });
  }
}
