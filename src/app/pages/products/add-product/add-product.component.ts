import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import { CategoriesService } from '../../../services/categories.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit{
  addForm = this.formBuilder.group({
    image: ['', Validators.required],
    name: ['', Validators.required],
    code: ['', Validators.required],
    cost: ['', Validators.required],
    quantity: ['', Validators.required],
    category: ['', Validators.required],

  })
  id: any;
  categorias:any = [];
  files: any;
  reader: any;
  public loaded = true;
  constructor(
    private formBuilder: FormBuilder, 
    private categoriesService: CategoriesService,
    private products: ProductsService, 
    private router: Router
    ){}


  ngOnInit(): void {
    this.categoriesService.getCategories()
    .subscribe((res:any) => {
      this.categorias = res;
    })
  }
  onSubmit(){
    var formData = new FormData();
    formData.append('name', this.addForm.value.name!);
    formData.append('code', this.addForm.value.code!);
    formData.append('cost', this.addForm.value.cost!);
    formData.append('quantity', this.addForm.value.quantity!);
    formData.append('id_category', this.addForm.value.category!);
    formData.append('image', this.files);
    
    this.products.addProduct(formData)
    .subscribe((res:any) =>  {
       if(res.status == 'success')
       {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto Guardado",
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigateByUrl('/main/products')
       }
        
    });

  }

  filefn(event: Event){
    this.files = (event.target as HTMLInputElement).files![0];
  }
}
