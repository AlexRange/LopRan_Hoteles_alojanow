import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Error404Component } from './components/error404/error404.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddHabitComponent } from './components/habitaciones/add-habit/add-habit.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { UpdateHabitComponent } from './components/habitaciones/update-habit/update-habit.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeComponent } from './components/home/home.component';
import { AddHComponent } from './components/hoteles/add-h/add-h.component';
import { HotelesComponent } from './components/hoteles/hoteles.component';
import { UpdateHComponent } from './components/hoteles/update-h/update-h.component';
import { NavigationAdminComponent } from './components/navigation-admin/navigation-admin.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NosotrsoComponent } from './components/nosotrso/nosotrso.component';
import { PreguntasFComponent } from './components/preguntas-f/preguntas-f.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';

import { CarruselComponent } from './components/carrusel/carrusel.component';

import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { HabitHotelComponent } from './components/hoteles-cliente/habit-hotel/habit-hotel.component';
import { HotelesClienteComponent } from './components/hoteles-cliente/hoteles-cliente.component';
import { HotelesDesComponent } from './components/hoteles-cliente/hoteles-des/hoteles-des.component';
import { AddPComponent } from './components/promociones/add-p/add-p.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { UpdatePComponent } from './components/promociones/update-p/update-p.component';
import { AddRComponent } from './components/reservaciones-hab/add-r/add-r.component';
import { ReservacionesHabComponent } from './components/reservaciones-hab/reservaciones-hab.component';
import { UpdateRComponent } from './components/reservaciones-hab/update-r/update-r.component';
import { PromocionesActivasComponent } from './components/promociones-activas/promociones-activas.component';
import { ReservacionesClienteComponent } from './components/reservaciones-cliente/reservaciones-cliente.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ReservasComponent } from './components/historiales/reservas/reservas.component';
import { ServiciosAdAdminComponent } from './components/servicios-ad-admin/servicios-ad-admin.component';
import { AddSComponent } from './components/servicios-ad-admin/add-s/add-s.component';
import { UpdateSComponent } from './components/servicios-ad-admin/update-s/update-s.component';
import { AsignarAHotelComponent } from './components/servicios-ad-admin/asignar-a-hotel/asignar-a-hotel.component';
import { ComentariosCComponent } from './components/historiales/comentarios-c/comentarios-c.component';
import { RecuperacionContrasenaComponent } from './components/recuperacion-contrasena/recuperacion-contrasena.component';
import { CategoryBarComponent } from './components/category-bar/category-bar.component';
import { ScrollButtonsComponent } from './components/scroll-buttons/scroll-buttons.component';
import { CtaButtonComponent } from './components/cta-button/cta-button.component';
import { AddTipohComponent } from './components/habitaciones/add-tipoh/add-tipoh.component';
import { UpdateTipohComponent } from './components/habitaciones/update-tipoh/update-tipoh.component';



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
    ReservacionesHabComponent,
    AddRComponent,
    UpdateRComponent,
    HotelesClienteComponent,
    HabitHotelComponent,
    HotelesDesComponent,
    PromocionesActivasComponent,
    ReservacionesClienteComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    ReservasComponent,
    ServiciosAdAdminComponent,
    AddSComponent,
    UpdateSComponent,
    AsignarAHotelComponent,
    ComentariosCComponent,
    RecuperacionContrasenaComponent,
    CategoryBarComponent,
    ScrollButtonsComponent,
    CtaButtonComponent,
    AddTipohComponent,
    UpdateTipohComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
