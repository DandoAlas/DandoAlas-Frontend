import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EscogerRutaComponent } from './components/escoger-ruta/escoger-ruta.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CrearVueloComponent } from './components/crear-vuelo/crear-vuelo.component';
import { PieComponent } from './components/pie/pie.component';
import { InformacionVueloComponent } from './components/informacion-vuelo/informacion-vuelo.component';

@NgModule({
  declarations: [
    AppComponent,
    EscogerRutaComponent,
    CrearVueloComponent,
    PieComponent,
    InformacionVueloComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
