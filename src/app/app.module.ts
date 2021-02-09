import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResumenComponent } from './components/resumen/resumen.component';
import { MenuComponent } from './shared/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { EvolucionComponent } from './components/evolucion/evolucion.component';
import { CanalesComponent } from './components/canales/canales.component';
import { ComparativaComponent } from './components/comparativa/comparativa.component';
import { CargoComponent } from './components/cargo/cargo.component';
import { TerritorialComponent } from './components/territorial/territorial.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FiltersComponent } from './shared/filters/filters.component';
import { SearchComponent } from './shared/search/search.component';
import { CanActivateAppLoad } from './services/apploaded.guard';

@NgModule({
  declarations: [
    AppComponent,
    ResumenComponent,
    MenuComponent,
    InicioComponent,
    SidebarComponent,
    EvolucionComponent,
    CanalesComponent,
    ComparativaComponent,
    CargoComponent,
    TerritorialComponent,
    ProductosComponent,
    RankingComponent,
    ClientesComponent,
    FiltersComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CanActivateAppLoad],
  bootstrap: [AppComponent]
})
export class AppModule { }
