import {Component,OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-box',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent implements OnInit{

  
  displayedColumns: string[] = ['total', 'card','cash','transfer', 'employee','type', 'date', 'options'];
  dataSource: MatTableDataSource<any>;
  sells: any = [];
  box: any ={};
  id:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: BoxesService, private route: ActivatedRoute) {

    
    

    
  }
  ngOnInit() {
    this.id =  this.route.snapshot.paramMap.get('id');
    this.service.getBox({id: this.id}).subscribe((res:any) => {

      this.box = res;
      res.tickets.map((key: any) => {
        const type = key.is_abono == 0 ? 'Normal' : 'Abono';
        this.sells.push({id: key.id, card: key.card, cash: key.cash, transfer: key.transfer, type: type, employee: key.employee ,date: key.created_at, total: key.total})
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
