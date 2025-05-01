import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule  } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { InventoryService } from '../../../services/inventory.service';
@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, RouterModule, FormsModule],
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss'
})
export class AddInventoryComponent {

  inventoryName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: InventoryService
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  iniciarInventario(): void {
    if (!this.inventoryName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Por favor, ingresa un nombre para el inventario.',
        confirmButtonColor: '#4f46e5',
      });
      return;
    }

    // Aquí iría la lógica real para guardar el inventario
    const data = {name: this.inventoryName, id_store: localStorage.getItem('id_store')};

    this.inventoryService.addInventory(data)
    .subscribe((res: any) => {
      
      
    })
    
    // Puedes pasar el nombre de regreso si lo necesitas
    this.dialogRef.close({ name: this.inventoryName });
  }
}
