import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscogerRutaComponent } from './components/escoger-ruta/escoger-ruta.component';
import { CrearVueloComponent } from './components/crear-vuelo/crear-vuelo.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AsientosComponent } from './components/asientos/asientos.component';

const routes: Routes = [
  {path:'inicio', component:HomeComponent},
  {path:'buscar-vuelo', component:EscogerRutaComponent},
  {path:'guardar-vuelo', component:CrearVueloComponent},
  {path:'login', component:LoginComponent},
  {path:'promociones', component:AsientosComponent},
 {path:'**', component:HomeComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
