import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryComponent } from './pages/category/category.component';
import { LoginComponent } from './pages/login/login.component';
import { BodyComponent } from './components/body/body.component';
import { permissionsGuard } from './guard/permissions.guard';
import { FormComponent } from './pages/category/form/form.component';
import { EditComponent } from './pages/category/edit/edit.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { AddClientComponent } from './pages/clients/add-client/add-client.component';
import { EditClientComponent } from './pages/clients/edit-client/edit-client.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { SeeInventoryComponent } from './pages/inventory/see-inventory/see-inventory.component';
import { PvComponent } from './pages/pv/pv.component';
import { authLoginGuard } from './guard/auth-login.guard';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { SeeTicketComponent } from './pages/tickets/see-ticket/see-ticket.component';
import { AddPayComponent } from './pages/tickets/add-pay/add-pay.component';
import { SellsComponent } from './pages/tickets/sells/sells.component';
import { BoxComponent } from './pages/tickets/box/box.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { AddEmployeeComponent } from './pages/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './pages/employees/edit-employee/edit-employee.component';
import { UpProductsComponent } from './pages/products/up-products/up-products.component';
import { UpProductComponent } from './pages/products/up-product/up-product.component';
import { DownProductComponent } from './pages/products/down-product/down-product.component';
import { DownProductsComponent } from './pages/products/down-products/down-products.component';
import { AbonosComponent } from './pages/tickets/abonos/abonos.component';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreComponent } from './pages/stores/store/store.component';
import { MainComponent } from './pages/kitchen/main/main.component';
import { TypePayComponent } from './pages/type-pay/type-pay.component';
import { CommandsManagerComponent } from './pages/kitchen/commands-manager/commands-manager.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent, canActivate: [authLoginGuard]
    },
    {
        path: 'main', component: BodyComponent, canActivate: [permissionsGuard],
        children: [
            {
                path: 'dashboard', component: DashboardComponent
            },
            {
                path: 'category', component: CategoryComponent
            },
            {
                path: 'add-category', component: FormComponent
            },
            {
                path: 'edit-category/:id', component: EditComponent
            },
            {
                path: 'products', component: ProductsComponent
            },
            {
                path: 'add-product', component: AddProductComponent
            },
            {
                path: 'edit-product/:id', component: EditProductComponent
            },
            {
                path: 'client', component: ClientsComponent
            },
            {
                path: 'add-client', component: AddClientComponent
            },
            {
                path: 'edit-client/:id', component: EditClientComponent
            },
            {
                path: 'inventory', component: InventoryComponent
            },
            {
                path: 'see-inventory/:id', component: SeeInventoryComponent
            },
            {
                path: 'pv', component: PvComponent
            },
            {
                path: 'tickets/:id', component: TicketsComponent
            },
            {
                path: 'see-ticket/:id', component: SeeTicketComponent
            },
            {
                path: 'add-pay/:id', component: AddPayComponent
            },
            {
                path: 'sells', component: SellsComponent
            },
            {
                path: 'box/:id', component: BoxComponent
            },
            {
                path: 'employees', component: EmployeesComponent
            },
            {
                path: 'add-employee', component: AddEmployeeComponent
            },
            {
                path: 'edit-employee/:id', component: EditEmployeeComponent
            },
            {
                path: 'up-products', component: UpProductsComponent
            },
            {
                path: 'up-product/:id', component: UpProductComponent
            },
            {
                path: 'down-product/:id', component: DownProductComponent
            },
            {
                path: 'down-products', component: DownProductsComponent
            },
            {
                path: 'abonos', component: AbonosComponent
            },
            {
                path: 'tiendas', component: StoresComponent
            },
            {
                path: 'tienda/:id', component: StoreComponent
            },
            {
                path: 'kitchen', component: MainComponent
            },
            {
                path: 'comandas-gerentes', component: CommandsManagerComponent
            },
            {
                path: 'pagos', component: TypePayComponent
            }
        ]
    },
    {
        path: 'login', component: LoginComponent, canActivate: [authLoginGuard]
    }, 
    
];
