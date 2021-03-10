import { Injectable } from '@angular/core';
import { BehaviorSubject, from, fromEvent, Observable, of, Subject } from 'rxjs';
import { filtros } from 'src/config/ventasGlobalIDs';
import {configQlik} from '../../config/config';
import { FiltersComponent } from '../shared/filters/filters.component';

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
  static qApp=null;
  static globals= {
    qlik: null,
    resize: null,
    selState: null
  };

  selecciones$;

  loaded: BehaviorSubject<boolean>;


 constructor() { 
  this.loaded = new BehaviorSubject<boolean>(false);
 
 }

 getAppLoaded(): Observable<boolean> {
  return this.loaded.asObservable();
}
setAppLoaded(newValue): void {
  this.loaded.next(newValue);
}

  qlikConnection(appId){

    this.setLoader("block");
    //Listener que pasaremos al iniciar qlik y, cuando se cambie algun dato de qlik, se ejecutara esta funcion
    var listener = function() {
          //Obtener el id del filtro teniendo el DIVid
          Object.values(filtros).forEach(filtro => {
            for (let i = 0; i < filtro.length; i++) {  
              ConnectionQlikService.globals.selState.selections.forEach(seleccion => {
                 if(seleccion.fieldName.toLowerCase() == filtro[i].div){
                   setTimeout(() => {
                     ConnectionQlikService.qApp.getObject("sel" +seleccion.fieldName.toLowerCase(), filtro[i].id);
                   }, 500);
                } 
              });  
            }  
          });
    };

    
    if(appId){
      if(this.qApp==null){

        return new Promise((resolve) => {
          import('./../../assets/js/qlik-connection.js').then(async file => {
            this.qApp = await file.default.qApp(configQlik, this.globals, appId, listener);
            this.globals = await file.default.q;
            ConnectionQlikService.globals =  this.globals;
            ConnectionQlikService.qApp =  this.qApp;
            this.selecciones$ = of(this.globals.selState.selections);
            console.log("Qlik:  ", this.qApp);
            resolve(this.qApp);
            this.setAppLoaded(true);
            this.setLoader("none"); 
          }​​​​​​​);
        });
  
      }else{
        this.setLoader("none");
        return this.qApp;
      }
    }else{
      return false;
    }

  }

  setLoader(display){
    let loaderHTML = document.getElementById("loader") as HTMLInputElement;  
    loaderHTML.style.display=display; 
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

}
