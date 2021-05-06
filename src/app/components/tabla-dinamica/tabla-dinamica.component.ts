import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

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
    this.promises.push(this._QlikConnection.getObject('calendario_barra', 'jvJpb'));
    this.promises.push(this._QlikConnection.getObject('tablaDin', 'VFSYrqU'));
    
    //Cuando todos los objetos se hayan cargado  
    this._ComunService.loadObjects(this.promises);
  }

}
