import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../services/categories.service';
import {MatButtonModule} from '@angular/material/button';

import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {

  addForm = this.formBuilder.group({
    image: ['', Validators.required],
    name: ['', Validators.required],
    code: ['', Validators.required],
    category: ['', Validators.required],
    quantity: ['', Validators.required],
    cost: ['', Validators.required]
  })
  
  files : any;
  categories: any = [];
  info : any = {};
  id: any;
  select : number = 2;
  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService, 
    private products: ProductsService, 
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit()
  {
    this.id = this.route.snapshot.paramMap.get('id');

    this.categoriesService.getCategories()
    .subscribe((res:any) => {
      this.categories = res;
    })

    this.products.getProduct({'id': this.id})
    .subscribe((res:any) =>
    {
      this.info = res;

      this.addForm.controls['name'].setValue(res.name);
      this.addForm.controls['code'].setValue(res.code);
      this.addForm.controls['cost'].setValue(res.cost);
      this.addForm.controls['quantity'].setValue(res.quantity);
      this.addForm.controls['category'].setValue(res.id_category);
    })

    
  }

  
  onSubmit()
  {
    var formData = new FormData();
    formData.append('code', this.addForm.value.code!);
    formData.append('name', this.addForm.value.name!);
    formData.append('cost', this.addForm.value.cost!);
    formData.append('quantity', this.addForm.value.quantity!);
    formData.append('id_category', this.addForm.value.category!);
    formData.append('image', this.files != undefined ? this.files : '');

    this.products.editProduct(formData)
    .subscribe((res:any) => {
      if(res.status == 'success')
      {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Producto Editada",
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigateByUrl('/main/products')
      }
    })
    

    
    
  }

  filefn(event: Event)
  {
    this.files = (event.target as HTMLInputElement).files![0];
  }

}
