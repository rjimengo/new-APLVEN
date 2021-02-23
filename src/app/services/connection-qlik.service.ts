import { Injectable } from '@angular/core';
import {configQlik} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ConnectionQlikService {

  globals = {
    qlik: null,
    resize: null
  };

  qApp=null;
  static globals= {
    qlik: null,
    resize: null
  };

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
    //comprobar si esta cargado en localStorage


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
      let selecciones = this.qApp.selectionState().selections;
      console.log("selecciones", selecciones);
      return selecciones;
    }
  }

}
