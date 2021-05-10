import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { configQlik } from 'src/config/config';

@Component({
  selector: 'app-tabla-dinamica',
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.css']
})
export class TablaDinamicaComponent implements OnInit {

  promises=[];
  objetos;

  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService) { }

  ngOnInit() {
    this.cargarDatos();
    
  }

  async cargarDatos(){
    this.promises.push(this._QlikConnection.getObject('calendario_escoger', 'VrCpHn'));
    this.promises.push(this._QlikConnection.getObject('calendario_barra', 'aPX'));
    this.promises.push(this._QlikConnection.getObject('tablaDin', 'VFSYrqU'));
    
    //Cuando todos los objetos se hayan cargado  
    this._ComunService.loadObjects(this.promises);
  }

  exportExcell(){
    let tablaID; 
    let labels = document.getElementsByClassName("hidden-screen-reader-label"); 
    
    for (let i = 0; i < labels.length; i++) {
      let label = labels[i] as HTMLInputElement;
      if(label.id){
        let labelIDArray = label.id.split("-");
        tablaID = labelIDArray[labelIDArray.length-1];
      }
    }
    if(tablaID){
      this._QlikConnection.exportExcell(tablaID);
    }
  }

}
