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

  loaded: BehaviorSubject<boolean>;//Variable para saber si la conexion con qlik ya se ha realizado
  primeraCarga:boolean=true;

  date;
  inicio:boolean = false;

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
    console.log("qlikConnection: " + appId);

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
      if(this.qApp==null || appId !=localStorage.getItem("appId")){
        this.setLoader("block");//Para la primera carga poner qlikloader a block

        return new Promise((resolve) => {
          import('./../../assets/js/qlik-connection.js').then(async file => {
            this.qApp = await file.default.qApp(configQlik, this.globals, appId, listener);
            this.globals = await file.default.q;
            ConnectionQlikService.globals =  this.globals;
            ConnectionQlikService.qApp =  this.qApp;
            this.selecciones$ = of(this.globals.selState.selections);
            console.log("Qlik:  ", this.qApp);
            resolve(this.qApp);
            this.setAppLoaded(true);//Poner a true la variable de conexion con Qlik

            //Controlar errores y timeouts de conexion con qlik
            this.controlarErrors();

          }​​​​​​​)
          .catch(err =>{
            this.controlarErrors();

            console.log("error al cargar: " + err);
            
          });
        });
  
      }else{
        this.setLoader("none");
        this.primeraCarga=false; //TODO esto es mentira
        return this.qApp;
      }
    }else{
      return false;
    }

  }

  controlarErrors(){
    this.qApp.on("closed", (error)=> {
      console.log(error);
      var titulo = "Se ha cerrado la conexión con el servidor de Qlik.";
      var secundario = "Por favor, recargue la aplicación.";
      
      let inputTitulo = document.getElementById("tituloId") as HTMLInputElement;
      let inputSecundario = document.getElementById("secundarioId") as HTMLInputElement;
      inputTitulo.value = titulo;
      inputSecundario.value = secundario;
      document.getElementById("openModalButton").click();
    });
    this.qApp.on("error", (error)=> {
      console.log(error.code + ' - ' + error.message);
      if (error.code == 16) {
        var titulo = "Se ha cerrado la conexión con el servidor de Qlik.";
        var secundario = "Por favor, recargue la aplicación.";
        
        let inputTitulo = document.getElementById("tituloId") as HTMLInputElement;
        let inputSecundario = document.getElementById("secundarioId") as HTMLInputElement;
        inputTitulo.value = titulo;
        inputSecundario.value = secundario;
        document.getElementById("openModalButton").click();

      } else if (error.code == 403) {   
        var titulo = "Acceso denegado.";
        var secundario = "No tiene acceso a la aplicación de Ventas, contacte con el administrador.";
        
        let inputTitulo = document.getElementById("tituloId") as HTMLInputElement;
        let inputSecundario = document.getElementById("secundarioId") as HTMLInputElement;
        inputTitulo.value = titulo;
        inputSecundario.value = secundario;
        document.getElementById("openModalButton").click();


      } else if (error.message.includes("timed out")) {   
        var titulo = "Se ha cerrado la conexión con el servidor de Qlik.";
        var secundario = "Por favor, recargue la aplicación.";
        
        let inputTitulo = document.getElementById("tituloId") as HTMLInputElement;
        let inputSecundario = document.getElementById("secundarioId") as HTMLInputElement;
        inputTitulo.value = titulo;
        inputSecundario.value = secundario;
        document.getElementById("openModalButton").click();

      } else if(!error.message.includes("ProxyError.OnSessionTimedOut")) { //Otros errores, como que un objeto no cargue bien
        console.log(error.code + ' - ' + error.message);
        let warn = document.getElementById("warn") as HTMLInputElement;
        warn.style.display="block";

      }
    });
  }

  
  setLoader(display){    
    let loaderHTML = document.getElementById("loader") as HTMLInputElement;  
    loaderHTML.style.display=display; 
  }
  
  getObject(id, value){
    let promesa = this.qApp.getObject(id, value);
    
    let elem = document.getElementById(id) as HTMLInputElement;   
    if(elem){
      elem.innerHTML=`<div class="spinner-grow spinner-grow-sm text-secondary" role="status">
                      <span class="sr-only">Loading...</span>
                  </div>`;      
      elem.setAttribute("qlikid", value);    
        
    } 
    return promesa;   
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

  /* Get the date from Qlik */
  getDate() {
    var promise = new Promise((resolve, reject) => { 
      this.qApp.variable.getContent('vL.FechaVentasHasta', function(reply) {
        if (reply && reply.qContent && reply.qContent.qString) {
            var newDate = new Date((reply.qContent.qString - (25567 + 2)) * 86400 * 1000);
            var year = newDate.getFullYear();
            //this.qApp.field('MES').selectMatch("*'" + year.toString().substr(2, 4));
            resolve(newDate);
        }
      });
    }) 
    return promise;
  }


}
