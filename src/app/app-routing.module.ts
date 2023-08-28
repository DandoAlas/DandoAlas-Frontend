import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscogerRutaComponent } from './components/escoger-ruta/escoger-ruta.component';
import { CrearVueloComponent } from './components/crear-vuelo/crear-vuelo.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path:'inicio', component:EscogerRutaComponent},
  {path:'guardar-vuelo', component:CrearVueloComponent},
  {path:'login', component:LoginComponent},
  {path:'**', component:EscogerRutaComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
