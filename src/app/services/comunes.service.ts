import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { configQlik } from 'src/config/config';
import {sales, cancelaciones, netos, nivelesApp, resumen, clientes, comparativa} from '../../config/ventasGlobalIDs';
import { ConnectionQlikService } from './connection-qlik.service';

@Injectable({
  providedIn: 'root'
})
export class ComunesService {

  selecciones = [];
  constructor(private _QlikConnection: ConnectionQlikService, private spinner: NgxSpinnerService) { }
  dimensions= ['Sin dimensión', 'Centros', 'Productos', 'Canal', 'Negocio', 'Segmento', 'Nivel Servicio', 'Agenven', 'Cargo'];
  
  sinDimensionOpt = ['Sin dimensión'];
  centrosOpt = ['DT', 'DG', 'DAN', 'Oficina', 'Ventanilla'];
  productosOpt = ['Producto N600', 'Producto N500', 'Producto N400', 'Producto N300', 'Producto N200', 'Producto N100', 'Producto N50'];
  canalOpt = ['Agrupación canal', 'Canal'];
  negocioOpt = ['Negocio', 'Subnegocio', 'Subsubnegocio'];
  segmentoOpt = ['Segmento', 'Subsegmento'];
  nivelServicioOpt = ['Nivel Servicio'];
  agenvenOpt = ['Agenven'];
  cargoOpt = ['Cargo', 'Responsabilidad'];
  selectors = [this.sinDimensionOpt, this.centrosOpt, this.productosOpt, this.canalOpt, this.negocioOpt, this.segmentoOpt, this.nivelServicioOpt, this.agenvenOpt, this.cargoOpt];

  nivelesDesc = ['Sin dimensión', 'DT', 'DG', 'DAN', 'Oficina', 'Ventanilla', 'Producto N600', 'Producto N500', 'Producto N400', 'Producto N300', 'Producto N200', 'Producto N100', 'Producto N50', 'Agrupación canal', 'Canal', 'Negocio', 'Subnegocio', 'Subsubnegocio', 'Segmento', 'Subsegmento', 'Nivel Servicio', 'Agenven', 'Cargo', 'Responsabilidad'];
  
  niveles = nivelesApp;
  employeeAvg = "Media Empleado";

  topBottomOpt = ['Top 20', 'Bottom 20'];


  employeeGlobal;
  percentageGlobal;
  topBottomGlobal;
  dimensionGlobal;
  optionGlobal;

  // Declare Sheet variables
  personalSheets = [];
  personalSheetsLoaded = false;

  setLoader(display){
    let loaderHTML = document.getElementById("loader") as HTMLInputElement;  
    loaderHTML.style.display=display; 
  }

  initFields(){
    this._QlikConnection.setNumValue('vL.IndicadorSel', 1);
		this._QlikConnection.setStringValue('vL.IndicadorSelDesc', 'Número (#)');
		this._QlikConnection.setStringValue('vL.IndicadorSelAbr', 'Num');
		this._QlikConnection.setStringValue('vL.FormatoIndicador', '#.##0 #');
		this._QlikConnection.setStringValue('vL.ClaseVenta', 'Ventas');
		
		this._QlikConnection.setNumValue('vL.MediaSel', 0);
		this._QlikConnection.setStringValue('vL.MediaSelDesc', '\'\'');
		
		this._QlikConnection.setNumValue('vL.PorcentajeSel', 0);
		this._QlikConnection.setStringValue('vL.PorcentajeSelDesc', '\'\'');
		
		this._QlikConnection.setNumValue('vL.TopSel', 0);
		this._QlikConnection.setNumValue('vL.BotSel', 0);
		
		this._QlikConnection.setNumValue('vL.DimensionSel', 10);
		this._QlikConnection.setStringValue('vL.DimensionCampo', '');
  }

  loadObjects(promises){
    this.spinner.show();    
    if(this._QlikConnection.primeraCarga){//Si es la primera carga
      this.spinner.hide();
    }

    /* Initialization of fields and variables and Get date  ASK*/
    if(this._QlikConnection.date == null){
      this.initFields();
      let fecha = this._QlikConnection.getDate();
      fecha.then((date) => { 
        this._QlikConnection.date = date;
      }) 
      .catch((error) => { 
        console.log(error)
      });
    }


    let count=0;
    promises.forEach(promesa => {
      promesa.then( (model)=>{
        count++;
        if(count==promises.length){
          this.spinner.hide();
          console.log("FINISH promesas");
          this.setLoader("none"); 
        }
      }).catch((err)=>{
        this.spinner.hide();
        console.log("Se ha producido un error al cargar el objeto ", err);
        this.setLoader("none");

      });
    });
  }

  radioButtons(value, operation, dimension, employee){
    //Guardar en localStorage el radio1
    if(value)
      localStorage.setItem('optionValue', value);

    let radio = localStorage.getItem('optionValue');
    //Si estamos en la pagina clientes y el radio es Margen, se inicializa a Numero
    let page = this.getPage();
    if(page=="clientes" && radio=="Margen"){
      radio = "Número";
      localStorage.setItem('optionValue', radio);
    }
    if(radio){
      //Aplicar metrica en qlik
      this.setMetrica(radio);
      //Poner a checked el radioButton al refrescar, setTimeout para que coja el elemento de la siguiente pestanya
      setTimeout(() => {
        switch(radio) { 
          case "Número": { 
            let elem = document.getElementById("radioNumero") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
          case "Importe": { 
            let elem = document.getElementById("radioImporte") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
          case "Margen": { 
            let elem = document.getElementById("radioMargen") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
       } 
      }, 0);
    }

    let percentage;
    // Disable % when metric = Margen
    if (radio == 'Margen') {
      /* Reset % y poner su checked a false*/
      percentage = this.initPercentage(radio, operation, dimension, employee, null, true);
    }
    return percentage;
  }

  setMetrica(metric){
    let id=1;
    let abr = 'Num';
    localStorage.setItem("metric", metric);
    
    switch (metric) {
      case 'Número':
        id = 1;
        abr = 'Num';
        break;
      case 'Importe':
        id = 2;
        abr = 'Imp';
        break;
      case 'Margen':
        id = 3;
        abr = 'Mar';
        break;
    };

    var unit = metric === 'Número' ? '#' : '€';
     
    this._QlikConnection.setNumValue('vL.IndicadorSel', id);
    this._QlikConnection.setStringValue('vL.IndicadorSelDesc', metric + ' (' + unit + ')');
    this._QlikConnection.setStringValue('vL.IndicadorSelAbr', abr);
    this._QlikConnection.setStringValue('vL.FormatoIndicador', '#.##0 ' + unit);
  }


  radioButtons2(value, metric, dimension, employee) {
    if(value)
      localStorage.setItem('optionValue2', value);

    let radio2 = localStorage.getItem('optionValue2');

    //Si estamos en la pagina clientes y el radio2 es Neto, se inicializa a Ventas
    let page = this.getPage();
    if(page=="clientes" && radio2=="Neto"){
      radio2 = "Ventas";
      localStorage.setItem('optionValue2', radio2);
    }
    if(radio2){
      this.setOperacion(radio2);
      setTimeout(() => {
        switch(radio2) { 
          case "Ventas": { 
            let elem = document.getElementById("radioVentas") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
          case "Cancelaciones": { 
            let elem = document.getElementById("radioCancelaciones") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
          case "Neto": { 
            let elem = document.getElementById("radioNeto") as HTMLInputElement;
            elem.checked = true;
             break; 
          } 
       } 
      }, 0);
    }
    let percentage;

    // Disable % when operation = Neto
    if (radio2 == 'Neto') {
      /* Reset % y poner su checked a false*/
      percentage = this.initPercentage(metric, radio2, dimension, employee, null, true);
    }
    return percentage;
}

/* Set operation */
setOperacion (operation) {
  var operationAbr = (operation == 'Cancelaciones') ? 'Cancel' : operation;
  this._QlikConnection.setStringValue('vL.ClaseVenta', operationAbr);

}

  changeView(apartado, vista, chart, table){
    switch(apartado){
      case "ventas":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(sales[chart].div, sales[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(sales[chart].div, sales[table].id);
        }
      break;
      case "cancelaciones":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(cancelaciones[chart].div, cancelaciones[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(cancelaciones[chart].div, cancelaciones[table].id);
        }
      break;
      case "neto":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(netos[chart].div, netos[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(netos[chart].div, netos[table].id);
        }
      break;
      case "edad"://Para la pestanya clientes: edad, producServ, negocio y saldo
        if(vista){
          vista=false;
          this._QlikConnection.getObject(clientes[chart].div, clientes[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(clientes[chart].div, clientes[table].id);
        }
      break;
      case "producServ":        
        if(vista){
          vista=false;
          this._QlikConnection.getObject(clientes[chart].div, clientes[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(clientes[chart].div, clientes[table].id);
        }
      break;
      case "negocio":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(clientes[chart].div, clientes[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(clientes[chart].div, clientes[table].id);
        }
      break;
      case "saldo":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(clientes[chart].div, clientes[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(clientes[chart].div, clientes[table].id);
        }
      break;
      case "TL": //Para comparativa graficas Top
        if(vista){
          vista=false;
          this._QlikConnection.getObject(comparativa.left[chart].div, comparativa.left[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(comparativa.left[chart].div, comparativa.left[table].id);
        }
      break;
      case "TR":
        if(vista){
          vista=false;
          this._QlikConnection.getObject(comparativa.right[chart].div, comparativa.right[chart].id);
        }
        else{
          vista=true;
          this._QlikConnection.getObject(comparativa.right[chart].div, comparativa.right[table].id);
        }
      break;
    }

    return vista;
  }

  maximizar(max){

    max = max ? false : true;

    setTimeout(()=>{
      let sidebar = document.getElementById("sidebar").style.width;
      var panelxl = document.getElementsByClassName("panel-xl")[0] as HTMLInputElement;     
      
      //se esconden todos los paneles 
      var paneles = document.getElementsByClassName("panel");
      for (let i = 0; i < paneles.length; i++) {
        let panel = paneles[i]  as HTMLInputElement;
        panel.style.display = "none";
      }


      if((sidebar  == "225px" || sidebar  == "") && panelxl){
        panelxl.style.paddingLeft = "225px";
      }else if(panelxl){
        panelxl.style.paddingLeft = "50px";
      }else{
        var paneles = document.getElementsByClassName("panel");
        for (let i = 0; i < paneles.length; i++) {
          let panel = paneles[i]  as HTMLInputElement;
          panel.style.paddingLeft = "0px";
          panel.style.display = "block";
        }
      }
      this._QlikConnection.resize();
    },100);


    return max;
  }


/* Set top chart/table1 objects dynamically */
  setObjects_1(vista, dimensionSel, topBottom, objetos) {
    let object = vista ? 'table1' : 'chart1';
    var dim = dimensionSel == 'Sin dimensión' ? object + '_sinDim' : object + '_Dim';
    
    let id = 1;
    let page = this.getPage();
    
    switch (topBottom) {
        case null || undefined:
            id = 1;
            break;
        case 'Top 20':
            id = 2;
            break;
        case 'Bottom 20':
            id = 3;
            break;
        case 'Top 50':
          id = 1;
          break;
        case 'Bottom 50':
          id = 2;
          break;
        default:
          id = 1;
          break;
    }

    if(page == "evolucion" && dimensionSel == 'Sin dimensión'){
      id=0;
    }

    if(page != "evolucion"){//Si no estamos en la pestanya evolucion se utilizar el _sinDim o _Dim
      id--;
      return this._QlikConnection.getObject("chart1", objetos[dim][id]);
    }else{
      return this._QlikConnection.getObject("chart1", objetos[object][id]);
    }
    
  }

  /* Set bottom chart/table objects dynamically */
  setObjects_2(vista, dimensionSel, topBottom, objetos, metric, operation) {
    if (dimensionSel !== 'Sin dimensión') {
      var object = vista ? 'table2' : 'chart2';
      var type;
      var id;
      let page = this.getPage();

      switch (topBottom) {
          case null || undefined:
              id = 0;
              break;
          case 'Top 20':
              id = 1;
              break;
          case 'Bottom 20':
              id = 2;
              break;
          default:
            id = 0;
            break;
      }
      if (metric != 'Margen' && operation != 'Neto') {
          type = vista ? 'table2' : 'pieChart';
      } else {
          type = vista ? 'table3' : 'bar';
      }

      if(page == "ranking"){ //En caso de ranking
        var object = 'chart2';
        var dim = dimensionSel == 'Sin dimensión' ? object + '_sinDim' : object + '_Dim';
        var id;
        switch (topBottom) {
            case 'Top 50':
                id = 0;
                break;
            case 'Bottom 50':
                id = 1;
                break;
        }
        return this._QlikConnection.getObject("chart2", objetos[dim][id]);
      }

      return this._QlikConnection.getObject("chart2", objetos[type][id]);
  }
    
  }



  setLevel(option){
    let index;
    for (let i = 0; i < this.nivelesDesc.length; i++) {      
      if(option == this.nivelesDesc[i]){
        index=i;
        break;
      }
    }
    this.optionGlobal= option;

		console.log('Dimension field: ' +  this.niveles[index].Id + ' - ' +  this.niveles[index].Field);

    this._QlikConnection.setNumValue('vL.DimensionSel', this.niveles[index].Id);
    this._QlikConnection.setStringValue('vL.DimensionCampo', this.niveles[index].Field);
  }

  /* Initialization of the employee's average variable */
  initEmployee(employee, percentage, reset, centros) {    
    var empl = (employee == null || percentage || reset || !centros) ? false : employee;    
    this.setEmployee(empl);    
    return empl;
  }

  setEmployee(employee){
    this.employeeGlobal = employee;
    /* Set the mployee's average variable */
    var value = !employee ? 0 : 1;
    var valueDesc = !employee ? '\'\'' : 'MediaEmpleado';
    this._QlikConnection.setNumValue('vL.MediaSel', value);
    this._QlikConnection.setStringValue('vL.MediaSelDesc', valueDesc);
    
    return employee;
  }

    /* Top and Bottom fields initializations */
    initTopBottom(init, topBottom) {
      if (init) {
        var top;
        switch (topBottom) {
            case null || undefined:
                top = 0;
                break;
            case 'Top 50':
                top = 50;
                break;
        }
        
        let tb = this.setTopBottom(null, topBottom);
        return tb;
      }
  }

  /* Set the Top and Bottom fields */
  setTopBottom(topBottom, newTopBottom) {
    let top;
    let bottom;
    var tB;
    let page = this.getPage();

    if(page=="ranking"){
      tB = newTopBottom;
      top = tB == 'Top 50' ? 50 : 0;
      bottom = tB == 'Bottom 50' ? 50 : 0;
    }else{
      tB = topBottom === newTopBottom ? null : newTopBottom;
      top = tB === 'Top 20' ? 20 : 0;
      bottom = tB === 'Bottom 20' ? 20 : 0;
    }
    
    this._QlikConnection.setNumValue('vL.TopSel', top);
    this._QlikConnection.setNumValue('vL.BotSel', bottom);

    this.topBottomGlobal = tB;
    return tB;
  }

  initPercentage(metric, operation, dimension, employee, percentage, reset){
    var pct = (typeof percentage === 'undefined' || dimension === 'Sin dimensión' || operation === 'Neto' || metric === 'Margen' || employee || reset) ? false : percentage;
    this.setPercentage(pct);
    if(!pct){
      let percen = document.getElementById("percen") as HTMLInputElement;
      if(percen)
        percen.checked = false;
    }else{
      setTimeout(() => {
        let percen = document.getElementById("percen") as HTMLInputElement;
        if(percen)
          percen.checked = true;
        
      }, );
    }
    
    return pct;
  }

  /* Set the & variable */
  setPercentage(percentage) {
    this.percentageGlobal= percentage;
    var value = !percentage ? 0 : 1;
    var valueDesc = !percentage ? '\'\'' : 'Porcentaje';
    this._QlikConnection.setNumValue('vL.PorcentajeSel', value);
    this._QlikConnection.setStringValue('vL.PorcentajeSelDesc', valueDesc);
    return percentage;
  }


  /* Dimension field initialization */
  initDimension(dimension, idx){
    let page = this.getPage();

    let isRankingOrClientes = (page == "ranking");
    //let isRankingOrClientes = (page == "ranking" || page == "clientes");

    var condition = isRankingOrClientes ? (dimension == this.dimensions[1] || dimension == this.dimensions[3] || dimension == this.dimensions[8]) : dimension == this.dimensions[idx];
    var dim = (typeof dimension == 'undefined' || condition) ? this.dimensions[0] : dimension;
    this.dimensionGlobal = dim;

    return dim;
  }

  initOption(dimension){
    if(this.optionGlobal && dimension != "Sin dimensión"){
      this.setLevel(this.optionGlobal);
    }else{
      this.optionGlobal = this.selectors[0][0];
      this.setLevel(this.selectors[0][0]);
    }

    return this.optionGlobal;
  }

  getPage(){//Obtener en que pestanya estamos, ranking, clientes, etc
    let url = window.location.pathname.split("/");
    let page="";
    if(url[url.length-1] != ""){
      page=url[url.length-1];
    }
    return page;
  }

  initializePersonalSheets() {
    let loaded = ((typeof this.personalSheetsLoaded == 'undefined' || !this.personalSheetsLoaded) ? true : this.personalSheetsLoaded);

    if (loaded) {
        this.personalSheetsLoaded = true;
        var qlikGlobal = this._QlikConnection.globals.qlik.getGlobal(configQlik);

        var promise = new Promise((resolve, reject) => {
            qlikGlobal.getAuthenticatedUser(function(reply) {
              var userName = reply.qReturn.substr(reply.qReturn.toLowerCase().lastIndexOf('userid=') + 7, reply.qReturn.length);
              var userDirectory = reply.qReturn.substr(reply.qReturn.toLowerCase().lastIndexOf('UserDirectory=') + 15, reply.qReturn.toLowerCase().indexOf(';') + 1 - 15);
              resolve(userName);
          });
        }); 
    }

    if(promise)
      return promise;
  }

  loadPersonalSheets() {
    let promise = this.initializePersonalSheets();

    promise.then((userName) => {

      
      var app = this._QlikConnection.globals.qlik.currApp();

      var sheetsPromise = new Promise((resolve, reject) => {

        app.getList('sheet', function(data) {
            var sheets = [];
            var sortBy = ('title' || 'rank');
            if (data && data.qAppObjectList && data.qAppObjectList.qItems) {
                var sortedData = data.qAppObjectList.qItems.sort(function(a, b) {
                    return a.qData[sortBy] - b.qData[sortBy];
                });
                sortedData.forEach(function(item) {
                    var ItemOwnerId = (item.qMeta.hasOwnProperty('owner')) ? item.qMeta.owner.userId : "";
                    if ((!item.qMeta.hasOwnProperty('owner')) || (ItemOwnerId !== "" && ItemOwnerId === userName)) {
                        sheets.push({
                            id: item.qInfo.qId,
                            name: item.qMeta.title
                        });
                    }
                });
                resolve(sheets);
            }
          });
      }); 

      sheetsPromise.then((sheets:any) => {
        this.personalSheets = sheets;
      })

    }) 
    .catch((error) => { 
      console.log(error)
    });

  }


  getPersonalSheets(){
    return this.personalSheets;
  }

  isPersonalSheetsPopulated() {
    return (this.personalSheets && this.personalSheets.length > 0);
  }
}
