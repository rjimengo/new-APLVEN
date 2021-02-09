import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private _QlikConnection: ConnectionQlikService) { }

  async ngOnInit() {
    this.obtenerBuscador();
  }

  obtenerBuscador(){
    /* this._QlikConnection.Qlik.getObject('qso_CurrentSelections', 'CurrentSelections') */
  }
}
