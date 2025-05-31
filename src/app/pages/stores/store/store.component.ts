import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreServiceService } from '../../../services/store-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TicketService } from '../../../services/ticket.service';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { UserService } from '../../../services/user.service';
import { InventoryService } from '../../../services/inventory.service';
import { AddInventoryComponent } from '../../inventory/add-inventory/add-inventory.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    RouterModule
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit{

  id_store: any;

  store: any = {};
  stores: any = [];
  categories: any = [];
  tickets: any = [];
  products: any = [];
  formData = new FormData();
  files: any; 
  ingredients:any =[];
  ingredientsProduct:any =[];
  employees:any = [];
  inventories: any = [];
  isLoading: boolean = true;
  coupons: any = [];


  //table for tickets
  displayedColumnsTickets: string[] = ['money_started', 'money_difference','start', 'end','options'];
  dataSourceTickets: MatTableDataSource<any>;
  @ViewChild('ticketsPaginator') ticketsPaginator: MatPaginator;

  //table for Coupons
  displayedColumnsCoupons: string[] = ['name','quantity', 'discount','options'];
  dataSourceCoupons: MatTableDataSource<any>;
  @ViewChild('couponsPaginator') couponsPaginator: MatPaginator;

  //table for Products
  displayedColumnsProducts: string[] = ['name', 'cost', 'category', 'options'];
  dataSourceProducts: MatTableDataSource<any>;
  @ViewChild('productsPaginator') productsPaginator: MatPaginator;

  //table for Ingredients
  displayedColumnsIngredient: string[] = ['name', 'quantity', 'options'];
  dataSourceIngredient: MatTableDataSource<any>;
  @ViewChild('ingredientPaginator') IngredientPaginator: MatPaginator;

  //table for Employees
  displayedColumnsEmployees: string[] = ['name', 'email', 'type', 'options'];
  dataSourceEmployees: MatTableDataSource<any>;
  @ViewChild('employeesPaginator') EmployeesPaginator: MatPaginator;

  //table for Inventories
  displayedColumnsInventories: string[] = ['id', 'name', 'finished' ,'date','options'];
  dataSourceInventories: MatTableDataSource<any>;
  @ViewChild('InventoriesPaginator') InventoriesPaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private storeService: StoreServiceService,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private productService: ProductsService,
    private inventoryService: InventoryService,
    private categoryService: CategoriesService,
     public dialog: MatDialog,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.id_store = this.route.snapshot.paramMap.get('id');
    localStorage.setItem('id_store', this.id_store);

    this.storeService.getStore({id: this.id_store})
    .subscribe((res:any) => {
      this.store = res;
    })

    this.getBoxes();
    this.getProducts();
    this.getEmployees();
    this.getIngredients();
    this.getInventories();
    this.getCoupons();

    this.categoryService.getCategories()
    .subscribe((res: any) => {
      this.categories = res;
      // this.isLoading = false; // activa loading
      
    })


    // this.isLoading = false;
  
  }

  getCoupons()
  {
    this.storeService.getCoupons({id_store: this.id_store})
    .subscribe((res: any) => {
      res.reverse();
      
      this.coupons = res;
      this.dataSourceCoupons = new MatTableDataSource(this.coupons);
      this.dataSourceCoupons.paginator = this.couponsPaginator;
      this.dataSourceCoupons.sort = this.sort;
    })
  }

  getBoxes()
  {
    this.ticketService.getBoxes({id_store: this.id_store})
    .subscribe((res:any) => {
      
      res.reverse();
      this.tickets = res;
      this.dataSourceTickets = new MatTableDataSource(this.tickets);
      this.dataSourceTickets.paginator = this.ticketsPaginator;
      this.dataSourceTickets.sort = this.sort;

    })
  }

  getProducts()
  {
    this.productService.getProductStore({id_store: this.id_store})
    .subscribe((res:any) => {
      this.products = res;
      
      this.dataSourceProducts = new MatTableDataSource(this.products);
      this.dataSourceProducts.paginator = this.productsPaginator;
      this.dataSourceProducts.sort = this.sort;
    })
  }

  getIngredients()
  {
    this.productService.getIngredients({id_store: this.id_store})
    .subscribe((res:any) => {
      
      this.ingredients = res;
      
      this.dataSourceIngredient = new MatTableDataSource(this.ingredients);
      this.dataSourceIngredient.paginator = this.IngredientPaginator;
      this.dataSourceIngredient.sort = this.sort;
    })
  }


  getEmployees()
  {
    this.userService.getEmployeeStore({id_store: this.id_store})
    .subscribe((res:any) => {
      res.map((empl: any) => {
        if(empl.type == 'manager')
        {
          empl.type = 'Colaborador 1'
        }
        else if(empl.type == 'waiter')
        {
          empl.type = 'Colaborador 2'
        }
        else
        {
          empl.type = 'Colaborador 3'
        }
      })
      this.employees = res;
      
      this.dataSourceEmployees = new MatTableDataSource(this.employees);
      this.dataSourceEmployees.paginator = this.EmployeesPaginator;
      this.dataSourceEmployees.sort = this.sort;
    })
  }

  getInventories()
  {
    this.inventoryService.getInventories({id_store: this.id_store})
    .subscribe((res:any) => {
      
      this.inventories = res;
      
      this.dataSourceInventories = new MatTableDataSource(this.inventories);
      this.dataSourceInventories.paginator = this.InventoriesPaginator;
      this.dataSourceInventories.sort = this.sort;
    })
  }

  applyFilterTickets(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceTickets.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceTickets.paginator) {
        this.dataSourceTickets.paginator.firstPage();
      }
    }

  applyFilterCoupon(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCoupons.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCoupons.paginator) {
      this.dataSourceCoupons.paginator.firstPage();
    }
  }


  applyFilterProducts(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProducts.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProducts.paginator) {
      this.dataSourceProducts.paginator.firstPage();
    }
  }  

  applyFilterIngredient(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceIngredient.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceIngredient.paginator) {
      this.dataSourceIngredient.paginator.firstPage();
    }
  }  

  applyFilterEmployees(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEmployees.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceEmployees.paginator) {
      this.dataSourceEmployees.paginator.firstPage();
    }
  }  

  applyFilterInventories(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInventories.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceInventories.paginator) {
      this.dataSourceInventories.paginator.firstPage();
    }
  }  
  

  addProduct() {
    this.formData = new FormData();
  
    // Generar las opciones del select a partir de las categorías
    const categoryOptions = this.categories
      .map((category:any) => `<option value="${category.id}">${category.name}</option>`)
      .join('');
  
    Swal.fire({
      title: "Sube el Producto",
      html: `
        <label for="name">Nombre</label>
        <input id="name" class="swal2-input" placeholder="Nombre del Producto">
        
        <label for="cost">Costo</label>
        <input id="cost" type="number" class="swal2-input" placeholder="Ingresa el costo">
  
        <label for="category">Categoría</label>
        <select id="category" class="swal2-select">
          <option value="" disabled selected>Selecciona una categoría</option>
          ${categoryOptions}
        </select>
  
        <label for="file">Sube la imagen</label>
        <input id="file" type="file" class="swal2-file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const codeInput = document.getElementById('code') as HTMLInputElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const costInput = document.getElementById('cost') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const fileInput = document.getElementById('file') as HTMLInputElement;
  
        const code = codeInput?.value.trim();
        const name = nameInput?.value.trim();
        const cost = costInput?.value.trim();
        const category = categorySelect?.value;
        const file = fileInput?.files?.[0];
  
        if ( !name || !cost || !category || !file) {
          Swal.showValidationMessage('Por favor llena todos los campos.');
          return false;
        }
  
        // Añadimos los valores a formData
        this.formData.append('name', name);
        this.formData.append('cost', cost);
        this.formData.append('id_category', category);
        this.formData.append('file', file);
        this.formData.append('id_store', this.id_store);
  
        return { code, name, cost, category, file };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.productService.addProduct(this.formData)
          .subscribe(
            (res: any) => {
              console.log(this.formData)
              Swal.fire('¡Producto añadido!', 'El producto se ha subido exitosamente.', 'success');
              this.getProducts();
            },
            (err: any) => {
              Swal.fire('Error', 'Hubo un problema al subir el producto.', 'error');
            }
          );
      }
    });
  }

  addCoupon()
  {

    this.formData = new FormData();
  
    // Generar las opciones del select a partir de las categorías
    const categoryOptions = this.categories
      .map((category:any) => `<option value="${category.id}">${category.name}</option>`)
      .join('');
  
    Swal.fire({
      title: "Añade el cupón",
      html: `
        <label for="name">Nombre</label>
        <input id="name" class="swal2-input" placeholder="Nombre del Cupón">
        
        <label for="quantity">Cantidad</label>
        <input id="quantity" type="number" class="swal2-input" placeholder="Ingresa la cantidad">
  
        <label for="discount">Descuento</label>
        <input id="discount" type="number" class="swal2-input" placeholder="Descuento %">
  
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Enviar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const quantityInput = document.getElementById('quantity') as HTMLInputElement;
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const discountInput = document.getElementById('discount') as HTMLInputElement;
  
        const quantity = quantityInput?.value.trim();
        const name = nameInput?.value.trim();
        const discount = discountInput?.value.trim();
  
        if ( !name || !quantity || !discount ) {
          Swal.showValidationMessage('Por favor llena todos los campos.');
          return false;
        }
  
        // Añadimos los valores a formData
        this.formData.append('name', name);
        this.formData.append('quantity', quantity);
        this.formData.append('discount', discount);
        this.formData.append('id_store', this.id_store);
  
        return { quantity, name, discount };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {

        this.storeService.addCoupon(this.formData)
          .subscribe(
            (res: any) => {

              Swal.fire('Cupón añadido!', 'El cupón se ha subido exitosamente.', 'success');
              this.getCoupons();
            },
            (err: any) => {
              Swal.fire('Error', 'Hubo un problema al subir el cupón.', 'error');
            }
          );
      }
    });

  }

  addIngredient()
  {
  this.formData = new FormData();
    
      Swal.fire({
        title: "Sube el Producto",
        html: `
          <label for="name">Nombre</label>
          <input id="name" class="swal2-input" placeholder="Nombre del Ingrediente">
          
          <label for="quantity">Cantidad</label>
          <input id="quantity" type="number" class="swal2-input" placeholder="Ingresa la cantidad">
    
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Enviar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const quantityIn = document.getElementById('quantity') as HTMLInputElement;
          const nameInput = document.getElementById('name') as HTMLInputElement;
    
          const quantity = quantityIn?.value.trim();
          const name = nameInput?.value.trim();
    
          if ( !name || !quantity) {
            Swal.showValidationMessage('Por favor llena todos los campos.');
            return false;
          }
    
          // Añadimos los valores a formData
          this.formData.append('name', name);
          this.formData.append('quantity', quantity);
          this.formData.append('id_store', this.id_store);
    
          return { quantity, name };
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.productService.addIngredient(this.formData)
            .subscribe(
              (res: any) => {
                Swal.fire('Ingrediente añadido!', 'El Ingrediente se ha subido exitosamente.', 'success');
                this.getIngredients();
              },
              (err: any) => {
                Swal.fire('Error', 'Hubo un problema al subir el producto.', 'error');
              }
            );
        }
      });
  }

  editIngredient(ingredient: any) {
    const formData = new FormData();
  
    Swal.fire({
      title: "Editar Ingrediente",
      html: `
        <label for="name">Nombre</label>
        <input id="name" class="swal2-input" value="${ingredient.name}" placeholder="Nombre del Ingrediente">
      
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
  
        const name = nameInput?.value.trim();
  
        if (!name) {
          Swal.showValidationMessage('Por favor llena todos los campos.');
          return false;
        }
  
        formData.append('name', name);
        formData.append('id_store', this.id_store);
        formData.append('id', ingredient.id); // ← importante para saber cuál editar
  
        return formData;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.productService.editIngredient(formData)
          .subscribe(
            (res: any) => {
              Swal.fire('¡Ingrediente actualizado!', 'Los cambios se han guardado exitosamente.', 'success');
              this.getIngredients();
            },
            (err: any) => {
              Swal.fire('Error', 'Hubo un problema al actualizar el ingrediente.', 'error');
            }
          );
      }
    });
  }
  

  addEmployee()
  {
    this.formData = new FormData();

    const employeeTypes = [
      { id: 'manager', name: 'Colaborador 1' },
      { id: 'waiter', name: 'Colaborador 2' },
      { id: 'kitchen', name: 'Colaborador 3' }
    ];

    const employeeOptions = employeeTypes
      .map(type => `<option value="${type.id}">${type.name}</option>`)
      .join('');

    Swal.fire({
      title: "Añadir Empleado",
      html: `
        <label for="firstName">Nombre</label>
        <input id="firstName" class="swal2-input" placeholder="Nombre del empleado">

        <label for="lastName">Apellido</label>
        <input id="lastName" class="swal2-input" placeholder="Apellido del empleado">

        <label for="email">Correo</label>
        <input id="email" type="email" class="swal2-input" placeholder="Correo electrónico">


        <label for="email">Contraseña</label>
        <input id="password" type="email" class="swal2-input" placeholder="Contraseña">


        <label for="employeeType">Tipo de Empleado</label>
        <select id="employeeType" class="swal2-select">
          <option value="" disabled selected>Selecciona el tipo</option>
          ${employeeOptions}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const firstName = (document.getElementById('firstName') as HTMLInputElement).value.trim();
        const lastName = (document.getElementById('lastName') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('password') as HTMLInputElement).value.trim();
        const employeeType = (document.getElementById('employeeType') as HTMLSelectElement).value;
        
        
        if (!firstName || !lastName || !email || !password || !employeeType) {
          Swal.showValidationMessage('Por favor, llena todos los campos.');
          return false;
        }

        const data = 
        {
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
          type: employeeType,
          store: this.id_store
        }
        this.userService.registerEmployee(data)
          .subscribe(
            (res: any) => {
              Swal.fire('¡Empleado añadido!', 'El empleado ha sido registrado exitosamente.', 'success');
              this.getEmployees();
            },
            (err: any) => {
              Swal.fire('Error', 'Hubo un problema al añadir el empleado.', 'error');
            }
          );

        return { data };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        
        
      }
    });

  }

  editProduct(product: any) {
    const categoryOptions = this.categories
      .map((category: any) => {
        const selected = category.id === product.id_category ? 'selected' : '';
        return `<option value="${category.id}" ${selected}>${category.name}</option>`;
      })
      .join('');
  
    Swal.fire({
      title: "Editar Producto",
      html: `
        <label for="name">Nombre</label>
        <input id="name" class="swal2-input" value="${product.name}" placeholder="Nombre del Producto">
        
        <label for="cost">Costo</label>
        <input id="cost" type="number" class="swal2-input" value="${product.cost}" placeholder="Ingresa el costo">
  
        <label for="category">Categoría</label>
        <select id="category" class="swal2-select">
          <option value="" disabled>Selecciona una categoría</option>
          ${categoryOptions}
        </select>
  
        <label for="file">Imagen (opcional)</label>
        <input id="file" type="file" class="swal2-file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const costInput = document.getElementById('cost') as HTMLInputElement;
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        const fileInput = document.getElementById('file') as HTMLInputElement;
  
        const name = nameInput.value.trim();
        const cost = costInput.value.trim();
        const category = categorySelect.value;
        const file = fileInput.files?.[0];
  
        if (!name || !cost || !category) {
          Swal.showValidationMessage('Por favor llena todos los campos obligatorios.');
          return false;
        }
  
        const formData = new FormData();
        formData.append('name', name);
        formData.append('cost', cost);
        formData.append('id_category', category);
        formData.append('id_store', this.id_store);
        formData.append('code', product.code);
        if (file) {
          formData.append('image', file); // debe coincidir con 'image' que espera tu back
        }
  
        return formData;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData = result.value as FormData; // Recuperamos el formData que generamos
        this.productService.editProduct(formData)
          .subscribe(
            (res: any) => {
              Swal.fire('¡Producto actualizado!', 'Los cambios se han guardado exitosamente.', 'success');
              this.getProducts();
            },
            (err: any) => {
              Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
            }
          );
      }
    });
  }
  

  startInventory()
  {
     const dialog = this.dialog.open(AddInventoryComponent, {
          data: { id: 2},
        });
        dialog.afterClosed().subscribe(() => {
          this.getInventories();
          
        });
  }

  openIngredientsModal(id: any, name: any) {


    this.productService.getIngredientsProduct({ id_product: id }).subscribe((res: any) => {
      this.ingredientsProduct = res;
  
      let html = `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Nombre</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Cantidad</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Eliminar</th>
            </tr>
          </thead>
          <tbody id="ingredientsTable">
            ${this.ingredientsProduct.map((ing: any) =>
              `<tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${ing.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${ing.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                  <button type="button" class="delete-btn" data-id="${ing.id}" style="padding: 4px 8px; background-color: #ff4d4d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    ❌
                  </button>
                </td>
              </tr>`
            ).join('')}
          </tbody>
        </table>
        <br>
        <label for="ingredient">Ingrediente:</label>
        <select id="ingredient" style="width: 100%; padding: 8px; margin-bottom: 10px;">
          ${this.ingredients.map((ing: any) => `<option value="${ing.id}">${ing.name}</option>`).join('')}
        </select>
        <label for="quantity">Cantidad:</label>
        <input id="quantity" type="number" style="width: 100%; padding: 8px; margin-bottom: 10px;">
      `;
  
      Swal.fire({
        title: 'Añadir Ingrediente para: ' + name,
        html: html,
        showCancelButton: true,
        confirmButtonText: 'Añadir',
        didOpen: () => {
          document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
              const ingId = button.getAttribute('data-id');
              this.deleteIngProd(ingId, id, name); // Pasar también el ID del producto para recargar
            });
          });
        },
        preConfirm: () => {
          const ingredient = (document.getElementById('ingredient') as HTMLSelectElement).value;
          const quantity = (document.getElementById('quantity') as HTMLInputElement).value;
  
          if (!ingredient || !quantity || parseFloat(quantity) <= 0) {
            Swal.showValidationMessage('Por favor, selecciona un ingrediente y una cantidad válida');
            return false;
          }
  
          const data = {
            id_ingredient: ingredient,
            quantity: quantity,
            id_product: id
          };
  
          this.productService.addIngredientsProduct(data).subscribe(() => {
            this.openIngredientsModal(id, name); // Recargar la lista actualizada
          });
  
          return true;
        }
      });
    });
  }
  
  deleteIngProd(ingId: any, productId: any, name:any) {
    this.productService.deleteIngredientProd({ id: ingId }).subscribe((res:any) => {
      
      this.openIngredientsModal(productId, name); // Volver a abrir el modal actualizado
    });
  }
  
  deleteInventory(id: any)
  {
    // this.inventoryService.delete({id: id})
    // .subscribe((res: any) => {})
  }

  delete(id:any)
  {

    Swal.fire({
      title: "Estas Seguro de eliminar la tienda?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        
        
      }
    });
  }

  deleteProduct(code: any)
  {

    Swal.fire({
      title: "Estas Seguro de eliminar el producto?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct({code: code})
        .subscribe((res: any) => {
          Swal.fire('Producto Eliminado')
          .then(() => {
            
            this.getProducts()
          })
        })
        
      }
    });
  }
  deleteCoupon(id: any)
  {
    Swal.fire({
      title: "Deseas eliminar el cupón?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Eliminar"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.storeService.deleteCoupon({id: id})
        .subscribe((res:any) =>{
    
    
          this.getCoupons();
          Swal.fire("Eliminado!");
        })

        
      }
    });
   
  }

  deleteEmployee(id: any)
  {
    Swal.fire({
      title: "Estas Seguro de eliminar el usuario?",
      text: "No podrás revertir la acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteEmployee({id: id})
        .subscribe((res: any) => {
          Swal.fire('Usuario Eliminado Eliminado')
          .then(() => {
            this.getEmployees()
          })
        })
        
      }
    });
  }

  upIngredient(id:any, ingredient: any)
  {
    Swal.fire({
      title: "Ingrese la Cantidad de alta para: " + ingredient,
      html: `
        <label for="quantity">Cantidad</label>
        <input id="quantity" type="number" class="swal2-input" placeholder="Cantidad" min="1">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const quantity = (document.getElementById('quantity') as HTMLInputElement).value.trim();
    
        if (!quantity || parseFloat(quantity) <= 0) {
          Swal.showValidationMessage('Por favor, ingresa una cantidad válida.');
          return false;
        }

        const data = 
        {
          id : id,
          quantity: quantity
        }
        this.productService.upProduct(data)
        .subscribe(() => {
          this.getIngredients();
        })
    
        return { quantity };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('¡Cantidad añadida!', `Has añadido: ${result.value.quantity}`, 'success')
        .then(() => {
          this.getIngredients();

        })
      }
    });
     
  }

  downIngredient(id:any, ingredient: any)
  {
    Swal.fire({
      title: "Ingrese la Cantidad de baja para: " + ingredient,
      html: `
        <label for="quantity">Cantidad</label>
        <input id="quantity" type="number" class="swal2-input" placeholder="Cantidad" min="1">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const quantity = (document.getElementById('quantity') as HTMLInputElement).value.trim();
    
        if (!quantity || parseFloat(quantity) <= 0) {
          Swal.showValidationMessage('Por favor, ingresa una cantidad válida.');
          return false;
        }

        const data = 
        {
          id : id,
          quantity: quantity
        }
        this.productService.downProduct(data)
        .subscribe(() => {
        })
    
        return { quantity };
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('¡Cantidad dada de baja!', `Has dado de baja: ${result.value.quantity}`, 'success')
        .then(() =>{
          
          this.getIngredients();
        })
      }
    });
    
  }

}
