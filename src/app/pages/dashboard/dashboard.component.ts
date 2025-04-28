import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

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
export class DashboardComponent implements AfterViewInit {
  @ViewChild('ventasDiariasChart') ventasDiariasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosPopularesChart') productosPopularesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('horariosVentaChart') horariosVentaChartRef!: ElementRef<HTMLCanvasElement>;

  tiendas = ['Tienda 1', 'Tienda 2', 'Tienda 3'];
  tiendaSeleccionada = 'Todas';
  periodoSeleccionado = 'Mes'; // Nuevo: periodo de filtrado

  resumenVentas = {
    ventasMes: 0,
    ventasSemana: 0
  };

  ventasRestaurantes = [
    { tienda: 'Tienda 1', nombre: 'Restaurante A', ventas: 20000, tickets: 120 },
    { tienda: 'Tienda 1', nombre: 'Restaurante B', ventas: 15000, tickets: 100 },
    { tienda: 'Tienda 2', nombre: 'Restaurante C', ventas: 10000, tickets: 80 },
    { tienda: 'Tienda 2', nombre: 'Restaurante D', ventas: 8000, tickets: 70 },
    { tienda: 'Tienda 3', nombre: 'Restaurante E', ventas: 5000, tickets: 40 },
  ];

  restaurantesFiltrados: any = [];

  ventasDiariasData: any = {
    'Tienda 1': [120, 150, 180, 90, 200, 250, 220],
    'Tienda 2': [80, 100, 110, 70, 90, 130, 140],
    'Tienda 3': [60, 70, 80, 50, 60, 90, 100],
    'Todas': [260, 320, 370, 210, 350, 470, 460],
  };

  ventasProductosData: any = {
    'Tienda 1': [300, 250, 200, 400],
    'Tienda 2': [200, 150, 180, 100],
    'Tienda 3': [100, 80, 90, 70],
    'Todas': [600, 480, 470, 570],
  };

  horariosVentaData: any = {
    'Tienda 1': [50, 120, 180, 100, 140],
    'Tienda 2': [30, 60, 90, 40, 70],
    'Tienda 3': [20, 30, 50, 25, 35],
    'Todas': [100, 210, 320, 165, 245],
  };

  ventasDiariasChart: any;
  productosPopularesChart: any;
  horariosVentaChart: any;

  constructor() {}

  ngAfterViewInit() {
    this.filtrarDatos();
  }

  filtrarDatos() {
    const tienda = this.tiendaSeleccionada;

    // Filtrar restaurantes
    if (tienda === 'Todas') {
      this.restaurantesFiltrados = this.ventasRestaurantes;
    } else {
      this.restaurantesFiltrados = this.ventasRestaurantes.filter(r => r.tienda === tienda);
    }

    // Actualizar resumen ventas
    const ventas = this.restaurantesFiltrados.reduce((sum : any, r: any) => sum + r.ventas, 0);
    const tickets = this.restaurantesFiltrados.reduce((sum: any, r: any) => sum + r.tickets, 0);

    this.resumenVentas = {
      ventasMes: ventas,
      ventasSemana: ventas / 4, // Suponiendo 4 semanas
    };

    // Actualizar gráficas
    this.actualizarGraficos();
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
    const dashboard = document.getElementById('dashboard-report');
    const options = {
      margin: 10,
      filename: 'reporte-finanzas.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // html2pdf().from(dashboard).set(options).save();
  }
}
