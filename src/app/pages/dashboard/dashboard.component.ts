import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  displayedColumns: string[] = ['name', 'day', 'week', 'month'];
  dataSource: MatTableDataSource<any>;
  dashboard: any = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sellers: any = [];
  constructor(private service : GeneralService)
  {}


  ngOnInit() {
    
    this.service.getDashboard()
    .subscribe((res:any) =>{
      this.dashboard = res;
      res.sellers.map((key:any) =>{
        this.sellers.push({name: key.firstname + ' ' + key.lastname, day: key.sellToday, week: key.sellWeekly, month: key.sellMonthly});
      })
      this.dataSource = new MatTableDataSource(this.sellers);
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
