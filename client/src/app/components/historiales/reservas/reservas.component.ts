import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { ReservacionesServiciosService } from '../../../services/reservaciones-servicios.service';
import { Hoteles, Reservaciones, ReservacionesServicios, ServiciosAdicionales } from './../../../models/modelos';
import { Auth } from './../../../services/auth.service';
import { HotelesService } from './../../../services/hoteles.service';
import { ReservacionesService } from './../../../services/reservaciones.service';
import { ServiciosAdicionalesService } from './../../../services/servicios-adicionales.service';

@Component({
  selector: 'app-reservas',
  standalone: false,
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  pendingReservations: (Reservaciones & { nombreHotel?: string })[] = [];
  otherReservations: (Reservaciones & { nombreHotel?: string })[] = [];
  loading: boolean = true;
  error: string | null = null;
  serviciosAdicionales: ServiciosAdicionales[] = [];
  loadingServicios: boolean = false;
  selectedServices: {[key: number]: boolean} = {};
  selectedReservationId: number | null = null;
  hoteles: Hoteles[] = [];

  constructor(
    private reservacionesService: ReservacionesService,
    private authService: Auth,
    private serviciosService: ServiciosAdicionalesService,
    private reservacionesServiciosService: ReservacionesServiciosService,
    private hotelesService: HotelesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadHotelesAndReservations();
  }

  loadHotelesAndReservations(): void {
    this.loading = true;
    
    // Cargar hoteles primero
    this.hotelesService.getHotel().subscribe({
      next: (hoteles) => {
        this.hoteles = hoteles;
        // Luego cargar reservaciones
        this.loadUserReservations();
      },
      error: (err) => {
        this.error = 'Error al cargar los hoteles';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadUserReservations(): void {
    this.loading = true;
    this.error = null;
    this.pendingReservations = [];
    this.otherReservations = [];

    const currentUser = this.authService.getCurrentUserValue();

    if (!currentUser?.id_usuario) {
      this.error = 'Debes iniciar sesión para ver tus reservaciones';
      this.loading = false;
      return;
    }

    this.reservacionesService.getReservacionesByIdUsuario(currentUser.id_usuario).subscribe({
      next: (reservations: Reservaciones[]) => {
        const reservationsArray = Array.isArray(reservations) ? reservations : [reservations];
        
        if (reservationsArray.length === 0) {
          this.error = 'No tienes reservaciones registradas';
        } else {
          // Procesar reservaciones pendientes
          this.pendingReservations = reservationsArray
            .filter((res: Reservaciones) => res.estado?.toString().toLowerCase() === 'pendiente')
            .map(res => ({
              ...res,
              nombreHotel: this.getHotelName(res.id_hotel)
            }));
          
          // Procesar otras reservaciones
          this.otherReservations = reservationsArray
            .filter((res: Reservaciones) => res.estado?.toString().toLowerCase() !== 'pendiente')
            .map(res => ({
              ...res,
              nombreHotel: this.getHotelName(res.id_hotel)
            }));
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando reservaciones:', err);
        this.error = 'Error al cargar las reservaciones. Por favor intenta más tarde.';
        this.loading = false;
      }
    });
  }

  getHotelName(id_hotel: number): string {
    if (!id_hotel) return 'Hotel no especificado';
    const hotel = this.hoteles.find(h => h.id_hotel === id_hotel);
    return hotel ? hotel.nombre : `Hotel ID: ${id_hotel}`;
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('confirmada')) return 'confirmed';
    if (statusLower.includes('cancelada')) return 'cancelled';
    if (statusLower.includes('completada')) return 'completed';
    return '';
  }

  openServicesModal(content: any, id_hotel: number, id_reservacion: number): void {
    this.loadingServicios = true;
    this.serviciosAdicionales = [];
    this.selectedServices = {};
    this.selectedReservationId = id_reservacion;
    
    this.serviciosService.getServiciosByHotel(id_hotel).subscribe({
      next: (servicios: ServiciosAdicionales[]) => {
        this.serviciosAdicionales = servicios;
        this.modalService.open(content, { 
          ariaLabelledBy: 'modal-services-title',
          size: 'lg',
          centered: true
        });
        this.loadingServicios = false;
      },
      error: (err: any) => {
        console.error('Error cargando servicios:', err);
        this.error = 'Error al cargar los servicios adicionales';
        this.loadingServicios = false;
      }
    });
  }

  toggleServiceSelection(id_servicio: number): void {
    this.selectedServices[id_servicio] = !this.selectedServices[id_servicio];
  }

  getSelectedServicesCount(): number {
    return Object.values(this.selectedServices).filter(selected => selected).length;
  }

  saveSelectedServices(): void {
    if (!this.selectedReservationId) {
        this.error = 'No hay reservación seleccionada';
        return;
    }

    const selectedServiceIds = Object.keys(this.selectedServices)
        .filter(key => this.selectedServices[parseInt(key)])
        .map(key => parseInt(key));

    if (selectedServiceIds.length === 0) {
        this.error = 'Por favor selecciona al menos un servicio';
        return;
    }

    this.loading = true;
    this.error = null;

    // Calcular el precio total de los servicios seleccionados
    const totalServicios = this.serviciosAdicionales
        .filter(s => selectedServiceIds.includes(s.id_servicio))
        .reduce((sum, servicio) => sum + (servicio.precio || 0), 0);

    // Obtener la reserva actual para sumar el precio existente
    const reservaActual = [...this.pendingReservations, ...this.otherReservations]
      .find(r => r.id_reservacion === this.selectedReservationId);
    
    const precioTotal = (reservaActual?.precio_total || 0) + totalServicios;

    // Actualizar la reservación
    this.reservacionesService.updateReservacion(this.selectedReservationId, {
        estado: 'confirmada',
        precio_total: precioTotal
    }).subscribe({
        next: () => {
            const saveRequests = selectedServiceIds.map(id_servicio => {
                const reservacionServicio: ReservacionesServicios = {
                    id_reservacion: this.selectedReservationId!,
                    id_servicio: id_servicio,
                    cantidad: 1,
                };
                return this.reservacionesServiciosService.saveReservacion(reservacionServicio);
            });

            forkJoin(saveRequests).subscribe({
                next: () => {
                    this.modalService.dismissAll();
                    this.loadUserReservations();
                },
                error: (err) => {
                    console.error('Error al guardar servicios:', err);
                    this.error = 'Error al guardar los servicios seleccionados';
                    this.loading = false;
                }
            });
        },
        error: (err) => {
            console.error('Error actualizando reservación:', err);
            this.error = 'Error al confirmar la reservación';
            this.loading = false;
        }
    });
  }

  cancelReservation(id_reservacion: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reservación?')) {
      this.loading = true;
      
      const update: Partial<Reservaciones> = { 
        estado: 'cancelada',
      };
      
      this.reservacionesService.updateReservacion(id_reservacion, update).subscribe({
        next: () => {
          this.loadUserReservations();
        },
        error: (err: any) => {
          console.error('Error cancelando reservación:', err);
          this.error = 'Error al cancelar la reservación. Por favor intenta nuevamente.';
          this.loading = false;
        }
      });
    }
  }
}