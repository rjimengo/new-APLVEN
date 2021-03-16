import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qlik-loader',
  templateUrl: './qlik-loader.component.html',
  styleUrls: ['./qlik-loader.component.css']
})
export class QlikLoaderComponent implements OnInit {

  textoBoleano:boolean=false;
  myHTML;
  constructor() { }

  ngOnInit(): void {
    //this.textoBoleano=true;
    setTimeout(() => {
      this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in">Abriendo aplicación...</div>';
    }, 500);
  }

}
