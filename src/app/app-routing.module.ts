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

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'resumen', component: ResumenComponent },
  { path: 'evolucion', component: EvolucionComponent },
  { path: 'territorial', component: TerritorialComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'canales', component: CanalesComponent },
  { path: 'cargo', component: CargoComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'comparativa', component: ComparativaComponent },
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
