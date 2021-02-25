import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { filtros } from 'src/config/ventasGlobalIDs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  filtrosOpen=filtros.fecha;
  filter="";
  selecciones=[];

  constructor( private _QlikConnection: ConnectionQlikService,
    private _ComunService: ComunesService) { }

  async ngOnInit(){
    //Cuando se cargue la aplicacion y se quite el loader se lanzara esta funcion
    setTimeout(async () => {
      await this._QlikConnection.getSelecciones();
      this._QlikConnection.selecciones$.subscribe(x => this.selecciones=x); 
    }, 5000);
  }

  expandir(){
    var element = document.getElementById("burguer");

    var panelxl = document.getElementsByClassName("panel-xl")[0] as HTMLInputElement;

    if( document.getElementById("menu").style.marginLeft == "50px"){
      //abrir sidebar
      element.classList.remove("active");
      document.getElementById("menu").style.marginLeft = "225px";
      document.getElementById("pestanya").style.marginLeft="225px";
      document.getElementById("sidebar").style.width = "225px";
      document.getElementById("cerrado").style.display = "none";
      document.getElementById("abierto").style.display = "block";

      if(panelxl){
        panelxl.style.paddingLeft = "225px"; 
      }

    }else{
      //cerrar sidebar
      element.classList.add("active");
      document.getElementById("menu").style.marginLeft = "50px";
      document.getElementById("pestanya").style.marginLeft="50px";
      document.getElementById("sidebar").style.width = "50px";
      document.getElementById("abierto").style.display = "none";
      document.getElementById("cerrado").style.display = "block";
      
      if(panelxl){
        panelxl.style.paddingLeft = "50px";
      }
    }
    setTimeout(()=>{
      this._QlikConnection.resize();
    },100);

  }

  loadFilter(filtro){
    let icons = document.getElementsByClassName("fa-caret-right");
    for (let i = 0; i < icons.length; i++) {
      let icon = icons[i] as HTMLInputElement;
      icon.style.transform = "rotate(0deg)";
    }


    if(this.filter!=filtro){

      this.filter=filtro;
      let icon;
      switch(filtro){
        case "fecha":
          this.filtrosOpen=filtros.fecha;
          icon = icons[0] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
        case "ventas":
          this.filtrosOpen=filtros.ventas;
          icon = icons[1] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
        case "centros":
          this.filtrosOpen=filtros.centros;
          icon = icons[2] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
       case "productos":
          this.filtrosOpen=filtros.productos;
          icon = icons[3] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
        case "clientesdb":
          this.filtrosOpen=filtros.clientesdb;
          icon = icons[4] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
          case "clientesms":
          this.filtrosOpen=filtros.clientesms;
          icon = icons[5] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
        case "clientesn":
          this.filtrosOpen=filtros.clientesn;
          icon = icons[6] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break;
        case "clientess":
          this.filtrosOpen=filtros.clientess;
          icon = icons[7] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break; 
        case "empleados":
          this.filtrosOpen=filtros.empleados;
          icon = icons[8] as HTMLInputElement;
          icon.style.transform = "rotate(90deg)";
        break; 
      }

      /* Get Ventas objects */
      for (var i = 0; i < this.filtrosOpen.length; i++) {
        this._QlikConnection.getObject(this.filtrosOpen[i].div, this.filtrosOpen[i].id);
      }
    }
    
  }

}
