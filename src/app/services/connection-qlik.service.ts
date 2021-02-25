import { Injectable } from '@angular/core';
import { from, fromEvent, Observable, of, Subject } from 'rxjs';
import { filtros } from 'src/config/ventasGlobalIDs';
import {configQlik} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConnectionQlikService {

  globals = {
    qlik: null,
    resize: null,
    selState: null
  };

  qApp=null;
  static globals= {
    qlik: null,
    resize: null,
    selState: null
  };

  selecciones$;
  selecciones=[];
  seleccionesPrevias=[];

  contadorselState=0;
  contadorseleccionesPrevias=0;

 constructor() { }

  qlikConnection(appId){




    if(appId){
      if(this.qApp==null){

        return new Promise((resolve) => {
          import('./../../assets/js/qlik-connection.js').then(async file => {
            this.qApp = await file.default.qApp(configQlik, this.globals, appId);
            this.globals = await file.default.q;
            ConnectionQlikService.globals =  this.globals;
            console.log("Qlik:  ", this.qApp);
            resolve(this.qApp);
          }​​​​​​​);
        });
  
      }else{
        return this.qApp;
      }
    }else{
      return false;
    }

  }

  getObject(id, value){
    this.qApp.getObject(id, value);
    
    let elem = document.getElementById(id) as HTMLInputElement;   
    if(elem){
      elem.innerHTML=`<div class="spinner-grow spinner-grow-sm text-secondary" role="status">
                      <span class="sr-only">Loading...</span>
                  </div>`;      
      elem.setAttribute("qlikid", value);
    }
  }
  setNumValue(value, id){
    this.qApp.variable.setNumValue(value, id);
  }
  setStringValue(value, id){
    this.qApp.variable.setStringValue(value, id);
  }
  exportExcell(qlikid){
    this.qApp.getObjectProperties(qlikid).then(function(model) {
      var table = ConnectionQlikService.globals.qlik.table(model);

      var exportOpts = {
          download: false
      };

      table.exportData(exportOpts, function(link) { 
        window.open(link, '_blank');
        console.log(link);                     
      });
    });
  }

  resize(){
    this.globals.qlik.resize();
  }

   async getSelecciones(){
    if(localStorage.getItem('appId')){
      await this.qlikConnection(localStorage.getItem('appId'));

      this.selecciones$ = of(this.qApp.selectionState().selections);




      setInterval(() => {
        
        let refresh=false;
        let contador2=0;
        

        
        this.globals.selState.selections.forEach(sel => {
          let elem = document.getElementById("sel" +sel.fieldName.toLowerCase()) as HTMLInputElement;  
          if(elem && !elem.getAttribute("qlikid")){
            refresh=true;
            console.log("refresh");
          } 
          contador2+=sel.selectedCount;
        });
        
        let contador=0;
        this.seleccionesPrevias.forEach(sel => {
          contador+=sel.selectedCount;
        });

        if(refresh || (this.globals.selState.selections.length != this.seleccionesPrevias.length) || (contador != contador2)){
          
          this.seleccionesPrevias=[];

          this.globals.selState.selections.forEach(sel => {
            this.seleccionesPrevias.push(sel);
          });
          console.log("cambio");
          
          //Obtener el id del filtro teniendo el DIVid
          Object.values(filtros).forEach(filtro => {
            for (let i = 0; i < filtro.length; i++) {  
    
              this.seleccionesPrevias.forEach(seleccion => {
                
                if(seleccion.fieldName.toLowerCase() == filtro[i].div){
                  this.getObject("sel" +seleccion.fieldName.toLowerCase(), filtro[i].id);
                }
              });
    
            }  
          });

        } 
      }, 800);  
      
    }
    
    return this.selecciones$;
  }


}
