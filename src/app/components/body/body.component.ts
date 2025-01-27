import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Input, ViewChild, AfterViewInit  } from '@angular/core';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-body',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent implements AfterViewInit{


  @ViewChild(SidebarComponent) child : any;

  bandAc : boolean;

  constructor(public storage: StorageService){
  }
  
  
  ngAfterViewInit(){
    this.bandAc = this.child.bandActive;
  }
}
