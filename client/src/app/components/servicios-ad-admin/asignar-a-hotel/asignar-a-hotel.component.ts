import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Hoteles } from '../../../models/modelos';
import { HotelesService } from '../../../services/hoteles.service';
import { ServiciosAdicionalesService } from '../../../services/servicios-adicionales.service';

@Component({
  selector: 'app-asignar-a-hotel',
  standalone: false,
  templateUrl: './asignar-a-hotel.component.html',
  styleUrl: './asignar-a-hotel.component.css'
})
export class AsignarAHotelComponent implements OnInit {
  @Input() id_servicio!: number;
  
  hoteles: Hoteles[] = [];
  hotelesConServicio: Hoteles[] = [];
  hotelesSinServicio: Hoteles[] = [];
  hotelesSeleccionados: number[] = [];
  isLoading: boolean = true;

  constructor(
    private hotelesService: HotelesService,
    private serviciosService: ServiciosAdicionalesService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.hotelesConServicio = [];
    this.hotelesSinServicio = [];
    this.hotelesSeleccionados = [];
    
    // Cargamos todos los hoteles
    this.hotelesService.getHotel().subscribe({
      next: (hoteles) => {
        // Eliminamos duplicados por id_hotel
        this.hoteles = this.eliminarDuplicados(hoteles, 'id_hotel');
        
        // Verificamos servicios para cada hotel único
        this.verificarServiciosEnHoteles();
      },
      error: (err) => {
        console.error('Error cargando hoteles:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los hoteles', 'error');
      }
    });
  }

  // Función para eliminar hoteles duplicados
  eliminarDuplicados(array: any[], key: string): any[] {
    return array.filter((obj, index, self) =>
      index === self.findIndex((t) => t[key] === obj[key])
    );
  }

  verificarServiciosEnHoteles(): void {
    let hotelesVerificados = 0;
    const totalHoteles = this.hoteles.length;
    
    if (totalHoteles === 0) {
      this.isLoading = false;
      return;
    }

    this.hoteles.forEach(hotel => {
      this.serviciosService.getServiciosByHotel(hotel.id_hotel).subscribe({
        next: (servicios) => {
          // Filtramos por el id_servicio actual
          const tieneEsteServicio = servicios.some(s => s.id_servicio === this.id_servicio);
          
          if (tieneEsteServicio) {
            this.hotelesConServicio.push(hotel);
          } else {
            this.hotelesSinServicio.push(hotel);
          }
          
          hotelesVerificados++;
          
          // Cuando terminamos de verificar todos los hoteles
          if (hotelesVerificados === totalHoteles) {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error(`Error verificando servicios para hotel ${hotel.id_hotel}:`, err);
          hotelesVerificados++;
          
          // En caso de error, asumimos que no tiene el servicio
          this.hotelesSinServicio.push(hotel);
          
          if (hotelesVerificados === totalHoteles) {
            this.isLoading = false;
          }
        }
      });
    });
  }

  asignarServicio(): void {
    if (!this.hotelesSeleccionados.length) {
      Swal.fire('Error', 'Debes seleccionar al menos un hotel', 'warning');
      return;
    }

    this.isLoading = true;
    const asignaciones = this.hotelesSeleccionados.map(id_hotel => 
      this.serviciosService.addServicioToHotel(id_hotel, this.id_servicio)
    );

    Promise.all(asignaciones.map(a => a.toPromise()))
      .then(() => {
        Swal.fire('Éxito', 'Servicio asignado correctamente', 'success');
        this.cargarDatos(); // Recargamos los datos
        this.hotelesSeleccionados = []; // Limpiamos selección
      })
      .catch(err => {
        console.error('Error asignando servicio:', err);
        Swal.fire('Error', 'No se pudo asignar el servicio a algunos hoteles', 'error');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  desasignarServicio(id_hotel: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desasignará el servicio del hotel seleccionado',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desasignar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.serviciosService.removeServicioFromHotel(id_hotel, this.id_servicio)
          .subscribe({
            next: () => {
              Swal.fire('Éxito', 'Servicio desasignado correctamente', 'success');
              this.cargarDatos(); // Recargamos los datos
            },
            error: (err) => {
              console.error('Error desasignando servicio:', err);
              Swal.fire('Error', 'No se pudo desasignar el servicio', 'error');
              this.isLoading = false;
            }
          });
      }
    });
  }

  closeModal(): void {
    this.activeModal.dismiss();
  }
}