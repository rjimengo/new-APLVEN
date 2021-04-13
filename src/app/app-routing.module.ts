import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanalesComponent } from './components/canales/canales.component';
import { CargoComponent } from './components/cargo/cargo.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ComparativaComponent } from './components/comparativa/comparativa.component';
import { EvolucionComponent } from './components/evolucion/evolucion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { TerritorialComponent } from './components/territorial/territorial.component';
import {CanActivateAppLoad} from './services/guards/apploaded.guard';
import { ventasGuard } from './services/guards/ventasGuard.guard';

const rutasHijas = [
  { path: 'resumen', component: ResumenComponent, canActivate: [CanActivateAppLoad]},
  { path: 'evolucion', component: EvolucionComponent, canActivate: [CanActivateAppLoad]},
  { path: 'territorial', component: TerritorialComponent, canActivate: [CanActivateAppLoad]},
  { path: 'productos', component: ProductosComponent, canActivate: [CanActivateAppLoad]},
  { path: 'canales', component: CanalesComponent, canActivate: [CanActivateAppLoad]},
  { path: 'cargo', component: CargoComponent, canActivate: [CanActivateAppLoad]},
  { path: 'ranking', component: RankingComponent, canActivate: [CanActivateAppLoad]},
  { path: 'clientes', component: ClientesComponent, canActivate: [CanActivateAppLoad]},
  { path: 'comparativa', component: ComparativaComponent, canActivate: [CanActivateAppLoad]},

];

const routes: Routes = [
  { path: '', component: InicioComponent },
  {
  path: 'ventas',
  canActivate: [ventasGuard],
  children: rutasHijas
},
{
  path: 'territorial',
  canActivate: [ventasGuard],
  children: rutasHijas
},
{
  path: 'vidacaixa',
  canActivate: [ventasGuard],
  children: rutasHijas
},
{
  path: 'segurcaixa',
  canActivate: [ventasGuard],
  children: rutasHijas
},

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }