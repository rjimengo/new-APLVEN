import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionQlikService {

  config = {
    host: "63.35.31.78", //the address of your Qlik Engine Instance
    prefix: "", //or the virtual proxy to be used. for example "/anonymous/"
    port: 80, //or the port to be used if different from the default port  
    isSecure: false, //should be true if connecting over HTTPS
    //webIntegrationId: 'web-integration-id-here' //only needed in SaaS editions and QSEoK
  };
  globals = {
    qlik: null,
    resize: null
  };

  Qlik=null;

 constructor() { }

  qlikConnection(appId){
    if(this.Qlik==null){

      return new Promise((resolve) => {
        import('./../../assets/js/qlik-connection.js').then(async file => {
          this.Qlik = await file.default.qApp(this.config, this.globals, appId);
          console.log("Qlik:  ", this.Qlik);
          resolve(this.Qlik);
        }​​​​​​​);
      });

    }else{
      return this.Qlik;
    }
  }

}
