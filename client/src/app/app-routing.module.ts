import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error404/error404.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { PreguntasFComponent } from './components/preguntas-f/preguntas-f.component';
import { NosotrsoComponent } from './components/nosotrso/nosotrso.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { PromocionesComponent } from './components/promociones/promociones.component';

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
    path: '**',
    component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
