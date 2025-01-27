import {Component,OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sells',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule],
  
  templateUrl: './sells.component.html',
  styleUrl: './sells.component.scss'
})
export class SellsComponent implements OnInit{

  displayedColumns: string[] = ['total', 'card','cash','transfer','date', 'options'];
  dataSource: MatTableDataSource<any>;
  sells: any = [];
  anOpenBox: boolean= false;
  idOpenBox: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: BoxesService) {

    
    

    
  }
  ngOnInit() {
    this.service.getSells().subscribe((res:any) => {
      console.log(res);
      
      res.map((key: any) => {

        
        this.sells.push({id: key.id, card: key.card, cash: key.cash, transfer: key.transfer, date: key.created_at, total: key.total})
        this.anOpenBox = key.is_closed == 0 ? true : this.anOpenBox;
        this.idOpenBox =  key.is_closed == 0 ? key.id : this.idOpenBox;
      })

      this.dataSource = new MatTableDataSource(this.sells);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
