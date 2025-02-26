import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddHabitComponent } from './components/habitaciones/add-habit/add-habit.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { UpdateHabitComponent } from './components/habitaciones/update-habit/update-habit.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeComponent } from './components/home/home.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { NavigationAdminComponent } from './components/navigation-admin/navigation-admin.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { Error404Component } from './components/error404/error404.component';
import { FooterComponent } from './components/footer/footer.component';
import { UpdateHComponent } from './components/hoteles/update-h/update-h.component';
import { AddHComponent } from './components/hoteles/add-h/add-h.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { NosotrsoComponent } from './components/nosotrso/nosotrso.component';
import { PreguntasFComponent } from './components/preguntas-f/preguntas-f.component';

import { CarruselComponent } from './components/carrusel/carrusel.component';

import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { AddPComponent } from './components/promociones/add-p/add-p.component';
import { UpdatePComponent } from './components/promociones/update-p/update-p.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    NavigationAdminComponent,
    HomeAdminComponent,
    HotelesComponent,
    HabitacionesComponent,
    AddHabitComponent,
    UpdateHabitComponent,
    Error404Component,
    FooterComponent,
    UpdateHComponent,
    AddHComponent,
    PrivacidadComponent,
    NosotrsoComponent,
    PreguntasFComponent,
    CarruselComponent,
    ComentariosComponent,
    PromocionesComponent,
    AddPComponent,
    UpdatePComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: 'dev-zyk6nh13wox8caf4.us.auth0.com', // Reemplaza con tu dominio de Auth0
      clientId: 'AUxGSgxECVmubohSz4hzHMjCsk9Odje3', // Reemplaza con tu Client ID de Auth0
      authorizationParams: {
        redirect_uri: window.location.origin, // URL de redirección después del login
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
