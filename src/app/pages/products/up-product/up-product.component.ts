import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-up-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './up-product.component.html',
  styleUrl: './up-product.component.scss'
})
export class UpProductComponent implements OnInit{

  idProduct: any = 0;

  formStartBox = this.fb.group({
    quantity: [0, Validators.required],
    id: [0, Validators.required]
  });

  product: any = {};


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private productService: ProductsService, private router: Router)
  {}
  ngOnInit() {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    this.formStartBox.patchValue({id: this.idProduct});
    this.productService.getProduct({'id': this.idProduct})
    .subscribe((res: any) => {
      this.product = res;
    })
  }
  onSubmit()
  {
    
    this.productService.upProduct(this.formStartBox.value)
    .subscribe((res:any) => {
      if(res.status == 'success')
        {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Altas Actualizadas",
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigateByUrl('/main/products')
        }
    })
  }
}
