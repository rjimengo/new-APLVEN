import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  expandir(){
    if( document.getElementById("menu").style.marginLeft == "50px"){
      //cerrar sidebar
      document.getElementById("menu").style.marginLeft = "160px";
      document.getElementById("pestanya").style.marginLeft="160px";
      document.getElementById("sidebar").style.width = "160px";

    }else{
      //abrir sidebar
      document.getElementById("menu").style.marginLeft = "50px";
      document.getElementById("pestanya").style.marginLeft="50px";
      document.getElementById("sidebar").style.width = "50px";
    }

  }

}
