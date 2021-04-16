import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { resumen } from 'src/config/ventasGlobalIDs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  app="";
  page="resumen";

  fecha;
  clickBusca:boolean = false;
  constructor(private router:Router,  private _QlikConnection: ConnectionQlikService) { }

  ngOnInit(){
    let url = window.location.pathname.split("/");
    if(url[url.length-1] != ""){
      this.page=url[url.length-1];
    }
    this.app = localStorage.getItem('app'); 

    if(this.page == this.app){
      this.page = "resumen";
      this.router.navigate([this.app + '/resumen']);
    }else if(this.app == null){
      this.router.navigate(['/']);
      
    }
    

    this._QlikConnection.getAppLoaded().subscribe((loaded) => {
      if(loaded){//Si la conexion de la appQlik esta cargada

        /* Initialization of fields and variables and Get date */
        this.fecha=this._QlikConnection.date;
        if(this._QlikConnection.date == null){
          let fecha = this._QlikConnection.getDate();
          fecha.then((date) => { 
            this._QlikConnection.date = date;
            this.fecha=date;
          }) 
          .catch((error) => { 
            console.log(error)
          });
        }

        //Cargar el buscador/panel de selecciones 
        this._QlikConnection.getObject('qso_CurrentSelections', 'CurrentSelections');

      }
    });

  }

  navigate(ruta){
    this.app = localStorage.getItem('app'); 
    this.page = ruta;
    this.router.navigate([this.app + '/' + ruta]);
    
  }

}
