let qlikHost = document.getElementById("qlikHost") as HTMLInputElement;  
let qlikPort = document.getElementById("qlikPort") as HTMLInputElement;  
let qlikPrefix = document.getElementById("qlikPrefix") as HTMLInputElement;  
let qlikIsSecure = document.getElementById("qlikIsSecure") as HTMLInputElement;  
let qlikAppId = document.getElementById("qlikAppId") as HTMLInputElement;  

//Configuracion para local
/*    export var configQlik = {
    host: "63.35.31.78", //the address of your Qlik Engine Instance
    prefix: "/", //or the virtual proxy to be used. for example "/anonymous/"
    port: 80, //or the port to be used if different from the default port  
    isSecure: false, //should be true if connecting over HTTPS
    //webIntegrationId: 'web-integration-id-here' //only needed in SaaS editions and QSEoK
  };  */
/*  export var appIDs = {
    global : "b310a657-9d26-431b-80df-ffe687e80a6d",
    territorial : "b310A657-9d26-431b-80df-ffe687e80a6d",
    vidacaixa : "b310A657-9d26-431b-80df-ffe687e80a6d",
    segurcaixa : "b310A657-9d26-431b-80df-ffe687e80a6d",
  }  */

  //configuracion para produccion
     export var configQlik = {
    host: qlikHost.value, //the address of your Qlik Engine Instance
    prefix: qlikPrefix.value, //or the virtual proxy to be used. for example "/anonymous/"
    port: qlikPort.value, //or the port to be used if different from the default port  
    isSecure: qlikIsSecure.value, //should be true if connecting over HTTPS
    //webIntegrationId: 'web-integration-id-here' //only needed in SaaS editions and QSEoK
  }; 

/*   export var appIDs = {
    global : "6d9683bf-5a03-422e-b5cb-291b38fc5448",
    territorial : "ec59e7f5-ca20-4971-96bb-685daf21d8f7",
    vidacaixa : "fca15b2e-40df-4a18-ac70-2eab1c39e6bb",
    segurcaixa : "0bd70671-4efa-4a86-a4f9-133e24e81853",
  } */

  let urlAyudaValue = document.getElementById("urlAyuda") as HTMLInputElement;  
  export var urlAyuda = urlAyudaValue.value;