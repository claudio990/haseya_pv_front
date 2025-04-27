import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })


  constructor( 
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private storage: StorageService, 
    private route: Router)
  {
  }

  onSubmit(){
    const data = this.loginForm.value;
    this.userService.login(data)
      .subscribe({
        next: (data: any) => {
          this.storage.set('token', data.token);
          
          this.storage.set('user', data.user.type);
          this.storage.set('id_user', data.user.id);
          this.storage.set('id_store', data.store.id);
          this.storage.set('store', data.store.name);
          
          Swal.fire({
            text : 'Ingreso Correctamente',
            confirmButtonColor: "#9f2220",
            confirmButtonText: "ok"
          }).then(() => {
            if(data.user.type == 'waiter' || data.user.type == 'manager')
            {
              location.assign("http://localhost:4200/main/pv");
            }
            else if(data.user.type == 'admin')
            {
              location.assign("http://localhost:4200/main/dashboard");
            }
            else if(data.user.type == 'kitchen')
            {
              location.assign("http://localhost:4200/main/kitchen");
            }
          })

          
          // location.reload();
          
        },
        error: (response : any) => {
          Swal.fire({
            text : 'Usuario o Contraseña incorrecta',
            confirmButtonColor: "#9f2220",
            confirmButtonText: "Volver a intentar"
          });
          console.log(response.error);
        }
      }
        
      )
    }

  

  main()
  {
    const data = this.loginForm.value;

    
    this.userService.login(data)
      .subscribe({
        next: (data: any) => {
          this.storage.set('token', data.token);
          this.route.navigate(['/main']);
          
          
        },
        error: (response : any) => {
          Swal.fire({
            text : 'Usuario o Contraseña incorrecta',
            confirmButtonColor: "#9f2220",
            confirmButtonText: "Volver a intentar"
          });
          console.log(response.error);
        }
      }
        
      )
  }

  test()
  {
    location.assign("http://localhost:4200/main");
    
  }

}
