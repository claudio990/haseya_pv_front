import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { InventoryService } from '../../../services/inventory.service';
@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent {

  addForm = this.formBuilder.group({
    quantity: ['0', Validators.required],
    name: ['', Validators.required]
  })
  constructor(
    @Inject(MAT_DIALOG_DATA ) public data: any, 
    private router: Router, 
    private dialogRef: MatDialogRef<AddInventoryComponent>,
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService
  ){}

  selection(quantity: any)
  {
    const name = this.addForm.value.name;
    if(name == '')
    {
      alert('Ingresa el nombre para el inventario');
    }
    else{
      this.inventoryService.addInventory({'quantity': quantity, 'name': name})
      .subscribe((res:any) => {
        if(res.status == "success")
        {
          this.dialogRef.close()
          this.router.navigate(['/main/see-inventory', res.id])
        }
        
      })

    }
  }

  persona()
  {
    const value = this.addForm.value.quantity;
    const name = this.addForm.value.name;

    if(value == '0' || this.addForm.value.name == '')
    {
      alert('Ingresa un número o nombre válido para iniciar el inventario');
    }
    else
    {
      this.inventoryService.addInventory({'quantity': value, 'name': name})
      .subscribe((res:any) => {
        if(res.status == "success")
        {
          this.dialogRef.close()
          this.router.navigate(['/main/see-inventory', res.id])
        }
        
      })
    }
    
  }
}
