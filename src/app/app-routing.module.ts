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
  { path: 'evolucion', component: EvolucionComponent, canActivate: [CanActivateAppLoad] },
  { path: 'territorial', component: TerritorialComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'canales', component: CanalesComponent },
  { path: 'cargo', component: CargoComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'comparativa', component: ComparativaComponent },

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



/* export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent, 
    canActivate: [AdminGuardGuard],
    children:[
      { path: 'crud-usuario', component: CrudUsuarioComponent },
      { path: 'crud-prof', component: CrudProfComponent },
      { path: 'crud-alumno', component: CrudAlumnoComponent },
      { path: 'crud-imparte', component: CrudImparteComponent },
      { path: 'crud-reserva', component: CrudReservaComponent},
      { path: 'crud-valoraciones', component: CrudValoracionesComponent},
      { path: 'crud-reportes', component: CrudReportesComponent},
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'crud-asignaturas', component: CrudAsignaturasComponent},
      { path: 'edit-asig/:id', component: EditAsigComponent},
      { path: 'crear-asig', component: CrearAsigComponent},
      { path: 'info/:id', component:InfoComponent},
      { path: 'panel', component:PanelComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
}) */