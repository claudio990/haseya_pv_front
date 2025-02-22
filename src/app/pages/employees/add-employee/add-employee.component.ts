import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../../services/categories.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { StoreServiceService } from '../../../services/store-service.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, 
    RouterModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent implements OnInit{
  addForm = this.formBuilder.group({
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    store: ['', Validators.required],
    type: ['', Validators.required],
  })

  files: any;
  reader: any;
  public loaded = true;
  stores: any = [];
  constructor(
    private formBuilder: FormBuilder, 
    private service: UserService, 
    private router: Router, 
    private storeService: StoreServiceService
  ){}

  ngOnInit(): void {
    this.storeService.getStores()
    .subscribe((res:any) => {
       this.stores = res
      });
  }

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
