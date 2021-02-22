import { Component, OnInit } from '@angular/core';
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
  constructor( private _QlikConnection: ConnectionQlikService) { }

  ngOnInit(): void {
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

    if(this.filter!=filtro){

      this.filter=filtro;
      switch(filtro){
        case "fecha":
          this.filtrosOpen=filtros.fecha;
        break;
        case "ventas":
          this.filtrosOpen=filtros.ventas;
        break;
        case "centros":
          this.filtrosOpen=filtros.centros;
        break;
       case "productos":
          this.filtrosOpen=filtros.productos;
        break;
        case "clientesdb":
          this.filtrosOpen=filtros.clientesdb;
        break;
          case "clientesms":
          this.filtrosOpen=filtros.clientesms;
        break;
        case "clientesn":
          this.filtrosOpen=filtros.clientesn;
        break;
        case "clientess":
          this.filtrosOpen=filtros.clientess;
        break; 
        case "empleados":
          this.filtrosOpen=filtros.empleados;
        break; 
      }

      /* Get Ventas objects */
      for (var i = 0; i < this.filtrosOpen.length; i++) {
        this._QlikConnection.getObject(this.filtrosOpen[i].div, this.filtrosOpen[i].id);
      }
    }
    
  }
}
