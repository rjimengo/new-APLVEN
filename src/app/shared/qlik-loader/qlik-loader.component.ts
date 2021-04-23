import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-qlik-loader',
  templateUrl: './qlik-loader.component.html',
  styleUrls: ['./qlik-loader.component.css']
})
export class QlikLoaderComponent implements OnInit {

  textoBoleano:boolean=false;
  myHTML;
  porcentaje=0;
  constructor(private _QlikConnection: ConnectionQlikService) {
    this.porcentaje=0;
   }

  ngOnInit() {
    setTimeout(() => {
      this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in">Abriendo aplicación...</div>';
    }, 500);

    let interval =  setInterval(() => {
       
      if(this.porcentaje<100){
        this.porcentaje+=Math.floor((Math.random()*5)+2);
        if(this.porcentaje>100){
          this.porcentaje=100;
        }
        this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in"> Cargando ' + this.porcentaje + '%</div>';
      }else if(this.porcentaje>=100 && this.porcentaje <200){
        this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in"> Terminando de abrir aplicación... </div>';
        clearInterval(interval);
      }else{
        return;
      }

      if(this._QlikConnection.error){
        this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in">Se ha producido un error </div>';
        clearInterval(interval);
      }
      let errorModal = document.getElementById("alertModal") as HTMLInputElement;
      if(errorModal && errorModal.style.display == "block"){
        console.log("errorModal.style.display: " + errorModal.style.display);
        this.myHTML ='<div class="qv-loader-text qv-loader-huge qv-fade-in">Se ha producido un error </div>';
        clearInterval(interval);
      }

    }, 5000); 

  }

}
