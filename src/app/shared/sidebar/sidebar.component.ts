import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor( private _QlikConnection: ConnectionQlikService) { }

  ngOnInit(): void {
  }

  expandir(){
    var element = document.getElementById("burguer");

    var panelxl = document.getElementsByClassName("panel-xl")[0] as HTMLInputElement;;

    if( document.getElementById("menu").style.marginLeft == "50px"){
      //abrir sidebar
      element.classList.remove("active");
      document.getElementById("menu").style.marginLeft = "225px";
      document.getElementById("pestanya").style.marginLeft="225px";
      document.getElementById("sidebar").style.width = "225px";
      document.getElementById("cerrado").style.display = "none";
      document.getElementById("abierto").style.display = "block";

      if(panelxl){
        panelxl.style.marginLeft = "225px"; 
        panelxl.style.width = "80%";
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
        panelxl.style.marginLeft = "50px";
        panelxl.style.width = "90%";
      }
    }
    setTimeout(()=>{
      this._QlikConnection.resize();
    },100);

  }
}
