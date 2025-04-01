import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { Error404Component } from './components/error404/error404.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ComentariosCComponent } from './components/historiales/comentarios-c/comentarios-c.component';
import { ReservasComponent } from './components/historiales/reservas/reservas.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeComponent } from './components/home/home.component';
import { HabitHotelComponent } from './components/hoteles-cliente/habit-hotel/habit-hotel.component';
import { HotelesClienteComponent } from './components/hoteles-cliente/hoteles-cliente.component';
import { HotelesDesComponent } from './components/hoteles-cliente/hoteles-des/hoteles-des.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { LoginComponent } from './components/login/login.component';
import { NosotrsoComponent } from './components/nosotrso/nosotrso.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PreguntasFComponent } from './components/preguntas-f/preguntas-f.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { PromocionesActivasComponent } from './components/promociones-activas/promociones-activas.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { ReservacionesHabComponent } from './components/reservaciones-hab/reservaciones-hab.component';
import { ServiciosAdAdminComponent } from './components/servicios-ad-admin/servicios-ad-admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'explorar-hoteles',
    component: HotelesClienteComponent
  },
  {
    path: 'hoteles/:id_hotel',
    component: HabitHotelComponent
  },
  {
    path: 'promociones-activas',
    component: PromocionesActivasComponent
  },
  {
    path: 'hoteles-destacados',
    component: HotelesDesComponent
  },
  {
    path: 'home-admin',
    component: HomeAdminComponent
  },
  {
    path: 'habitaciones-admin',
    component: HabitacionesComponent
  },
  {
    path: 'hoteles-admin',
    component: HotelesComponent
  },
  {
    path: 'comentarios-admin',
    component: ComentariosComponent
  },
  {
    path: 'promociones-admin',
    component: PromocionesComponent
  },
  {
    path: 'reservaciones-admin',
    component: ReservacionesHabComponent
  },
  {
    path: 'serviciosAd-admin',
    component: ServiciosAdAdminComponent
  },
  {
    path: 'preguntas-frec',
    component: PreguntasFComponent
  },
  {
    path: 'privacidad',
    component: PrivacidadComponent
  },
  {
    path: 'nosotros',
    component: NosotrsoComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'mi-perfil',
    component: PerfilComponent
  },
  {
    path: 'mis-reservaciones',
    component: ReservasComponent
  },
  {
    path: 'mis-comentarios',
    component: ComentariosCComponent
  },
  {
    path: '**',
    component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
