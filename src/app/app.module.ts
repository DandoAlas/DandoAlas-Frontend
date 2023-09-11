import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EscogerRutaComponent } from './components/escoger-ruta/escoger-ruta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CrearVueloComponent } from './components/crear-vuelo/crear-vuelo.component';
import { PieComponent } from './components/pie/pie.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { AsientosComponent } from './components/asientos/asientos.component';

@NgModule({
  declarations: [
    AppComponent,
    EscogerRutaComponent,
    CrearVueloComponent,
    PieComponent,
    LoginComponent,
    HomeComponent,
    PromocionesComponent,
    AsientosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
