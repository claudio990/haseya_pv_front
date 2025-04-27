import { Component, OnInit, HostListener } from '@angular/core';
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
export class BodyComponent implements AfterViewInit, OnInit{
  isMobile: boolean = false;

  @ViewChild(SidebarComponent) child : any;

  bandAc : boolean;

  constructor(public storage: StorageService){
  }
  ngOnInit(): void {
    this.checkScreenSize();
  }
  
  ngAfterViewInit(){
    this.bandAc = this.child.bandActive;
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Puedes ajustar el ancho (por ejemplo, 768px para móviles)
  }
}
