import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FinanzasService } from '../../services/finanzas.service';



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
  @ViewChild('ventasDiariasChart') ventasDiariasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productosPopularesChart') productosPopularesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('horariosVentaChart') horariosVentaChartRef!: ElementRef<HTMLCanvasElement>;

  tiendas = ['Tienda 1', 'Tienda 2', 'Tienda 3'];
  tiendaSeleccionada = 'Todas';
  periodoSeleccionado = 'Mes';

  resumenVentas = {
    ventasMes: 0,
    ventasSemana: 0
  };

  ventasRestaurantes: any[] = [];
  restaurantesFiltrados: any = [];

  ventasDiariasData: any = {};
  ventasProductosData: any = {};
  horariosVentaData: any = {};

  ventasDiariasChart: any;
  productosPopularesChart: any;
  horariosVentaChart: any;

  constructor(private apiService: FinanzasService) {}

  ngOnInit() {
    this.obtenerDatos();  // Llamar a la función obtenerDatos al inicializar el componente
  }

  ngAfterViewInit() {
    // Puedes poner lógica adicional si necesitas que los gráficos se inicien después de la vista
  }

  obtenerDatos() {
    this.apiService.obtenerResumenVentas().subscribe({
      next: (response) => {
        const { resumen, ventasRestaurantes, ventasDiariasData, ventasProductosData, horariosVentaData } = response;
  
        // Resumen general
        this.resumenVentas = {
          ventasMes: resumen.ventas_,
          ventasSemana: resumen.ventas_ / 4,
        };
  
        // Ventas por tienda
        this.ventasRestaurantes = [];
        for (const tienda in ventasRestaurantes) {
          if (ventasRestaurantes.hasOwnProperty(tienda)) {
            this.ventasRestaurantes.push(...ventasRestaurantes[tienda]);
          }
        }
  
        // Asignar datos de gráficas
        this.ventasDiariasData = ventasDiariasData;
        this.ventasProductosData = ventasProductosData;
        this.horariosVentaData = horariosVentaData;
  
        this.filtrarDatos();
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
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
  
    // --- Ventas diarias (line chart)
    const fechas = Object.keys(this.ventasDiariasData);
    const montos = Object.values(this.ventasDiariasData);
  
    this.ventasDiariasChart = new Chart(this.ventasDiariasChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: 'Ventas diarias',
          data: montos,
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          fill: true,
        }]
      },
      options: { responsive: true }
    });
  
    // --- Productos populares (bar chart)
    const labelsProductos = this.ventasProductosData.map((p: any) => p.name);
    const valoresProductos = this.ventasProductosData.map((p: any) => parseInt(p.total_vendido));
  
    this.productosPopularesChart = new Chart(this.productosPopularesChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labelsProductos,
        datasets: [{
          label: 'Productos más vendidos',
          data: valoresProductos,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: { responsive: true }
    });
  
    // --- Horarios de venta (bar chart)
    const horas = Object.keys(this.horariosVentaData);
    const ventasHoras = Object.values(this.horariosVentaData);
  
    this.horariosVentaChart = new Chart(this.horariosVentaChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: horas.map(h => `${h}:00`),
        datasets: [{
          label: 'Ventas por horario',
          data: ventasHoras,
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