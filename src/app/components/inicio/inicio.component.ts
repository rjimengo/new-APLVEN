import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private _QlikConnection: ConnectionQlikService,
    private router:Router) { }
  appId="93026550-480f-4bef-ad64-14aa46bc4ae2";

  ngOnInit() {
  }

  async openApp(){
    console.log("openapp");
    
    await this._QlikConnection.qlikConnection(this.appId);
    localStorage.setItem('appId', this.appId);
    this.router.navigate(['/resumen']);
  }

}
