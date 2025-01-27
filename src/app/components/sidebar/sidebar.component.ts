import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{

  bandActive : boolean;
  constructor(private route: Router, public storage: StorageService){
    this.bandActive = this.storage.bandActive;
  }

  bandAdmin : boolean = false;
  ngOnInit() {
    const type = localStorage.getItem('user')

    this.bandAdmin = type == 'admin' ? true : false; 
    
    
  }

  logOut()
  {
    this.storage.clear();
    this.route.navigateByUrl('/login'); 
    location.reload();
  }

  change()
  {
    this.storage.bandActive = this.storage.bandActive == false ? true : false;
    
  }

}
