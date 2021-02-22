import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  app="";
  page="resumen";
  constructor(private router:Router) { }

  ngOnInit(){
    console.log("oninit");
    
    this.app = localStorage.getItem('app'); 
  }

  navigate(ruta){
    this.app = localStorage.getItem('app'); 
    this.page = ruta;
    this.router.navigate([this.app + '/' + ruta]);
    
  }

}
