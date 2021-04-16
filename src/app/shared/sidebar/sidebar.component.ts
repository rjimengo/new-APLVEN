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
  appLoaded=false;

  constructor( private _QlikConnection: ConnectionQlikService,
    private _ComunService: ComunesService) { }

  async ngOnInit(){

    //Cuando se termine la conexion con qlik
    this._QlikConnection.getAppLoaded().subscribe((loaded) => {
      if(loaded){
        this.appLoaded=true;
        this._QlikConnection.selecciones$.subscribe(x => this.selecciones=x);
      }
    });

    setInterval(() => {
    }, 200);

  }

  expandir(){
    var element = document.getElementById("burguer");

    var panelxl = document.getElementsByClassName("panel-xl")[0] as HTMLInputElement;

    if(document.getElementsByClassName("qv-global-selections-enabled")[0]){
      var qvSel = document.getElementsByClassName("qv-global-selections-enabled")[0].getElementsByClassName("qv-global-selections")[0] as HTMLElement; 
      console.log(qvSel);

    }
    

    if( document.getElementById("menu").style.marginLeft == "50px"){
      //abrir sidebar
      element.classList.remove("active");
      element.style.marginRight="0";
      document.getElementById("menu").style.marginLeft = "225px";
      document.getElementById("pestanya").style.marginLeft="225px";
      document.getElementById("sidebar").style.width = "225px";
      document.getElementById("cerrado").style.display = "none";
      document.getElementById("abierto").style.display = "block";
      document.getElementById("CurrentSelections").style.width = "calc(100% - 225px)";//Buscador
      if(qvSel){
        qvSel.style.marginLeft = "225px";//Panel de selecciones
        qvSel.style.width = "calc(100% - 225px)";//Panel de selecciones
      }

      if(panelxl){
        panelxl.style.paddingLeft = "225px"; 
      }

    }else{
      //cerrar sidebar
      element.classList.add("active");
      element.style.marginRight="8px";
      document.getElementById("menu").style.marginLeft = "50px";
      document.getElementById("pestanya").style.marginLeft="50px";
      document.getElementById("sidebar").style.width = "50px";
      document.getElementById("abierto").style.display = "none";
      document.getElementById("cerrado").style.display = "block";
      document.getElementById("CurrentSelections").style.width = "calc(100% - 50px)";
      if(qvSel){
        qvSel.style.marginLeft = "50px";//Panel de selecciones
        qvSel.style.width = "calc(100% - 50px)";//Panel de selecciones        
      }
      

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

  removeFilter(filtro){
    this._QlikConnection.qApp.field(filtro).clear();
  }
  clearSelections(){
    this._QlikConnection.qApp.selectionState().clearAll();
  }
  
  //back y forward en filters.ts

}
