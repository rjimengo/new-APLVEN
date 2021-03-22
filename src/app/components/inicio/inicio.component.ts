import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import {appIDs} from '../../../config/config';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  selApp:boolean=false;
  constructor(
    private _QlikConnection: ConnectionQlikService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  async openApp(aplicacion){
    this._QlikConnection.inicio = true;
    if(!aplicacion){
      this.selApp=true;
      let select = document.getElementById("navigation") as HTMLInputElement;
      aplicacion=select[0].value;
    }
    let IDapp;
    localStorage.setItem('app', aplicacion);  

    switch(aplicacion){
      case "ventas":
        IDapp = appIDs.global;
      break;
      case "territorial":
        IDapp = appIDs.territorial;
      break;
      case "vidacaixa":
        IDapp = appIDs.vidacaixa;
      break;
      case "segurcaixa":
        IDapp = appIDs.segurcaixa;
      break;
      default:
        IDapp = appIDs.global;
    }
    
    if(await this._QlikConnection.qlikConnection(IDapp)){
      localStorage.setItem('appId', IDapp); 
      this.router.navigate([aplicacion + '/resumen']);      
    } 

  }

}
