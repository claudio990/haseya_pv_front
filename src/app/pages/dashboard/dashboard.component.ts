import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StoreServiceService } from '../../services/store-service.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    FormsModule, // <- ¡Importado aquí!
  ],
  
})
export class DashboardComponent implements AfterViewInit, OnInit {
    // ViewChilds
    @ViewChild('ventasDiariasChart') ventasDiariasChartRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('productosPopularesChart') productosPopularesChartRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('horariosVentaChart') horariosVentaChartRef!: ElementRef<HTMLCanvasElement>;
  
    // Propiedades
    periodoSeleccionado: 'day' | 'week' | 'month' = 'month';
    tiendaSeleccionada: string = 'Todas';
  
    resumenVentas: any;
    ventasRestaurantes: any[] = [];
    ventasDiariasData: any;
    ventasProductosData: any;
    horariosVentaData: any;
    restaurantesFiltrados: any[] = [];
  
    ventasDiariasChart: any;
    productosPopularesChart: any;
    horariosVentaChart: any;
    tiendas: any = [];
  
    constructor(private service: StoreServiceService) {}
  
    ngOnInit(): void {
      this.loadDashboard();
    }
  
    loadDashboard(id_store?: number, period: 'day' | 'week' | 'month' = 'month') {
      this.service.getDashboardData(id_store, period).subscribe(data => {
        this.resumenVentas = data.resumenVentas;
        this.ventasRestaurantes = data.ventasRestaurantes;
        this.ventasDiariasData = data.ventasDiariasData;
        this.ventasProductosData = data.ventasProductosData;
        this.horariosVentaData = data.horariosVentaData;
      });
    }
  
    ngAfterViewInit() {
      this.filtrarDatos();
    }
  
    filtrarDatos() {
      const period = this.periodoSeleccionado;
      const idStore = this.tiendaSeleccionada === 'Todas' ? undefined : Number(this.tiendaSeleccionada);
  
      this.service.getDashboardData(idStore, period).subscribe((data) => {
        this.resumenVentas = data.resumenVentas;
        this.restaurantesFiltrados = data.restaurantes;
        this.ventasDiariasData = data.ventasDiarias;
        this.ventasProductosData = data.ventasProductos;
        this.horariosVentaData = data.horariosVenta;
        this.actualizarGraficos();
      });
    }
  

  actualizarGraficos() {
    if (this.ventasDiariasChart) this.ventasDiariasChart.destroy();
    if (this.productosPopularesChart) this.productosPopularesChart.destroy();
    if (this.horariosVentaChart) this.horariosVentaChart.destroy();

    const tienda = this.tiendaSeleccionada;

    this.ventasDiariasChart = new Chart(this.ventasDiariasChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [{
          label: 'Ventas diarias',
          data: this.ventasDiariasData[tienda],
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          fill: true,
        }]
      },
      options: { responsive: true }
    });

    this.productosPopularesChart = new Chart(this.productosPopularesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Hamburguesa (12PM)', 'Pizza (2PM)', 'Papas (8PM)', 'Refresco (1PM)'],
        datasets: [{
          label: 'Productos + Horario de Venta',
          data: this.ventasProductosData[tienda],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      options: { responsive: true }
    });

    this.horariosVentaChart = new Chart(this.horariosVentaChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['10AM', '12PM', '2PM', '6PM', '8PM'],
        datasets: [{
          label: 'Ventas por horario',
          data: this.horariosVentaData[tienda],
          backgroundColor: '#42A5F5'
        }]
      },
      options: { responsive: true }
    });
  }

  exportarPDF() {
    const element = document.getElementById('dashboard-report');
    if (!element) return;
  
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('reporte-finanzas.pdf');
    });
  }
  
}
