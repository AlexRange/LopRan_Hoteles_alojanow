import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ComentariosCalificaciones } from './../../../models/modelos';
import { ComentariosService } from './../../../services/comentarios.service';
import { HotelesService } from './../../../services/hoteles.service';
import { Hoteles } from './../../../models/modelos';

@Component({
  selector: 'app-comentarios-c',
  standalone: false,
  templateUrl: './comentarios-c.component.html',
  styleUrl: './comentarios-c.component.css'
})
export class ComentariosCComponent implements OnInit {
  comentarios: (ComentariosCalificaciones & { nombreHotel?: string })[] = [];
  loading: boolean = true;
  error: string = '';
  editingComment: ComentariosCalificaciones | null = null;
  showEditForm: boolean = false;
  hoteles: Hoteles[] = [];

  constructor(
    private comentariosService: ComentariosService,
    private hotelesService: HotelesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadHotelesAndComentarios();
  }

  loadHotelesAndComentarios(): void {
    this.loading = true;
    
    // Primero cargamos los hoteles
    this.hotelesService.getHotel().subscribe({
      next: (hoteles) => {
        this.hoteles = hoteles;
        // Luego cargamos los comentarios
        this.loadComentarios();
      },
      error: (err) => {
        this.error = 'Error al cargar los hoteles';
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadComentarios(): void {
    this.comentariosService.getComentarios().subscribe({
      next: (data) => {
        this.comentarios = data.map(comment => ({
          ...comment,
          calificacion: Number(comment.calificacion),
          nombreHotel: this.getHotelName(comment.id_hotel)
        }));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al cargar los comentarios';
        console.error(err);
        this.loading = false;
      }
    });
  }

  getHotelName(id_hotel: number): string {
    const hotel = this.hoteles.find(h => h.id_hotel === id_hotel);
    return hotel ? hotel.nombre : 'Hotel no encontrado';
  }

  deleteComentario(id_comentario: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      this.comentariosService.deleteComentario(id_comentario).subscribe({
        next: () => {
          this.comentarios = this.comentarios.filter(c => c.id_comentario !== id_comentario);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error = 'Error al eliminar el comentario';
          console.error(err);
        }
      });
    }
  }

  startEdit(comentario: ComentariosCalificaciones): void {
    this.editingComment = { ...comentario };
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.editingComment = null;
    this.showEditForm = false;
  }

  submitEdit(form: NgForm): void {
    if (form.valid && this.editingComment) {
      const commentToUpdate = {
        ...this.editingComment,
        calificacion: Number(this.editingComment.calificacion)
      };

      this.comentariosService.updateComentario(
        commentToUpdate.id_comentario, 
        commentToUpdate
      ).subscribe({
        next: (updatedComment) => {
          const index = this.comentarios.findIndex(c => c.id_comentario === updatedComment.id_comentario);
          if (index !== -1) {
            Object.assign(this.comentarios[index], {
              ...updatedComment,
              calificacion: Number(updatedComment.calificacion),
              nombreHotel: this.getHotelName(updatedComment.id_hotel)
            });
          }
          this.cancelEdit();
          this.cdr.markForCheck();
          this.loadComentarios();
        },
        error: (err) => {
          this.error = 'Error al actualizar el comentario';
          console.error(err);
        }
      });
    }
  }
}