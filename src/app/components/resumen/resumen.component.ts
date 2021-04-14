import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { sales, cancelaciones, netos } from '../../../config/ventasGlobalIDs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

export class ResumenComponent implements OnInit {
  
  metric:string = "";
  vistaVentas:boolean = false;
  vistaCancelaciones:boolean = false;
  vistaNeto:boolean = false;

  maxVentas:boolean = false;
  maxCancelaciones:boolean = false;
  maxNeto:boolean = false;
  
  promises=[];

  constructor(
    private _QlikConnection: ConnectionQlikService,
    private _ComunService: ComunesService) { }
  
  async ngOnInit() {
    this.cargarDatos();
    this._ComunService.radioButtons(null, null, null, null);   
    this.metric = localStorage.getItem("metric");
    
  }

  cargarDatos(){     

    this.promises.push(this._QlikConnection.getObject('calendario_escoger', 'VrCpHn'));
    this.promises.push(this._QlikConnection.getObject('calendario_escoger', 'jvJpb'));
    
    /* Get Ventas objects */
    for (var i = 0; i < sales.length; i++) {
      this.promises.push(this._QlikConnection.getObject(sales[i].div, sales[i].id));
    }
    /* Get Cancelaciones objects */
    for (var i = 0; i < cancelaciones.length; i++) {
      this.promises.push(this._QlikConnection.getObject(cancelaciones[i].div, cancelaciones[i].id));
    }
    /* Get Netos objects */
    for (var i = 0; i < netos.length; i++) {
      this.promises.push(this._QlikConnection.getObject(netos[i].div, netos[i].id));
    }

    //Cuando todos los objetos se hayan cargado 
    this._ComunService.loadObjects(this.promises);

  }

  changeOption(value){
    this._ComunService.radioButtons(value, null, null, null);
    this.metric = value;
  }


    /* Switch between chart and table view */
  changeView(apartado){

    switch(apartado){
      case "ventas":
        this.vistaVentas = this._ComunService.changeView(apartado, this.vistaVentas, 5, 6);
      break;
      case "cancelaciones":
        this.vistaCancelaciones = this._ComunService.changeView(apartado, this.vistaCancelaciones, 5, 6);
      break;
      case "neto":
        this.vistaNeto = this._ComunService.changeView(apartado, this.vistaNeto, 5, 6);
      break;
    }
    
  }

  exportExcell(grafica){
    let graf = grafica as HTMLInputElement;
    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }

  maximizar(apartado){

    switch(apartado){
      case "ventas":
        this.maxVentas = this._ComunService.maximizar(this.maxVentas);
      break;
      case "cancelaciones":
        this.maxCancelaciones = this._ComunService.maximizar(this.maxCancelaciones);
      break;
      case "neto":
        this.maxNeto = this._ComunService.maximizar(this.maxNeto);
      break;
    }

  }

}
