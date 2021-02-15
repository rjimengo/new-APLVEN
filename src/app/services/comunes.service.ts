import { Injectable } from '@angular/core';
import {sales, cancelaciones, netos} from '../../config/ventasGlobalIDs';
import { ConnectionQlikService } from './connection-qlik.service';

@Injectable({
  providedIn: 'root'
})
export class ComunesService {

  constructor(private _QlikConnection: ConnectionQlikService) { }

  changeView(apartado, vista, chart, table){
    switch(apartado){
      case "ventas":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(sales[chart].div, sales[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(sales[chart].div, sales[table].id);
        }
      break;
      case "cancelaciones":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(cancelaciones[chart].div, cancelaciones[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(cancelaciones[chart].div, cancelaciones[table].id);
        }
      break;
      case "neto":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(netos[chart].div, netos[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(netos[chart].div, netos[table].id);
        }
      break;
    }
    return vista;
  }

  maximizar(apartado, max){


    switch(apartado){
      case "ventas":
        max = max ? false : true;
      break;
      case "cancelaciones":
        max = max ? false : true;
      break;
      case "neto":
        max = max ? false : true;
      break;
    }
    this._QlikConnection.resize();
    return max;
  }
}
