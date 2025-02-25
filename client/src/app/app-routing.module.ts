import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error404/error404.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { PreguntasFComponent } from './components/preguntas-f/preguntas-f.component';

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
    path: 'preguntas-frec',
    component: PreguntasFComponent
  },
  {
    path: 'privacidad',
    component: PrivacidadComponent
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
