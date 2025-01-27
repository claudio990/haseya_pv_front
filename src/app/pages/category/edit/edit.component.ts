import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import {MatButtonModule} from '@angular/material/button';

import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {


  addForm = this.formBuilder.group({
    image: ['', Validators.required],
    name: ['', Validators.required],
  })
  
  files : any;

  info : any ={};
  id: any;
  constructor(
    private formBuilder: FormBuilder, 
    private categories: CategoriesService, 
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit()
  {
     this.id = this.route.snapshot.paramMap.get('id');

    this.categories.getCategory({'id': this.id})
    .subscribe((res:any) =>
    {
      this.info = res;
    })
  }

  
  onSubmit()
  {
    this.categories.editCategory({'id': this.id, 'name': this.addForm.value.name})
    .subscribe((res:any) => {
      if(res.status == 'success')
      {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Categoría Editada",
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigateByUrl('/main/category')
      }
    })
    

    
    
  }

  filefn(event: Event)
  {
    this.files = (event.target as HTMLInputElement).files![0];
  }
}
