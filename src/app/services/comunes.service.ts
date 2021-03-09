import { Injectable } from '@angular/core';
import {sales, cancelaciones, netos, nivelesApp, resumen} from '../../config/ventasGlobalIDs';
import { ConnectionQlikService } from './connection-qlik.service';

@Injectable({
  providedIn: 'root'
})
export class ComunesService {

  selecciones = [];
  constructor(private _QlikConnection: ConnectionQlikService) { }
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

  radioButtons(value){
    //Guardar en localStorage el radio1
    if(value)
      localStorage.setItem('optionValue', value);

    let radio = localStorage.getItem('optionValue');
    if(radio){
      //Aplicar metrica en qlik
      this.setMetrica(radio);
      //Poner a checked el radioButton al refrescar
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
    }
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


    // Disable % when metric = Margen
    if (metric === 'margen') {
      /* Reset % */
      /*$scope.percentage = commonFactory.initPercentage($rootScope.metric, $rootScope.operation, $rootScope.dimension, $rootScope.employee, null, true);
      $rootScope.percentage = $scope.percentage;
      $('#percentage').prop('checked', false); */
   }
  }


  radioButtons2(value) {
    if(value)
      localStorage.setItem('optionValue2', value);

    let radio2 = localStorage.getItem('optionValue2');

    if(radio2){
      this.setOperacion(radio2);
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
    }
}

/* Set operation */
setOperacion (operation) {

    var operationAbr = (operation == 'Cancelaciones') ? 'Cancel' : operation;
    this._QlikConnection.setStringValue('vL.ClaseVenta', operationAbr);

    // Disable % when operation = Neto
    if (operation === 'Neto') { //TODO
        // Reset % 
/*         $scope.percentage = commonFactory.initPercentage($rootScope.metric, $rootScope.operation, $rootScope.dimension, $rootScope.employee, null, true);
        $rootScope.percentage = $scope.percentage;
        $('#percentage').prop('checked', false); */
    }


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
      case "resumen":
        if(vista){
          vista=false;
          this._QlikConnection.getObject("chart1", resumen.chart1[0]);
        }
        else{
          vista=true;
          this._QlikConnection.getObject("chart1", resumen.table1[0]);
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
    let id = 0;
    
    if (dimensionSel !== 'Sin dimensión') {
        switch (topBottom) {
            case null:
                id = 1;
                break;
            case 'Top 20':
                id = 2;
                break;
            case 'Bottom 20':
                id = 3;
                break;
        }
    }
    
    this._QlikConnection.getObject(object, objetos[object][id]);
  }



  setLevel(option){
    let index;
    for (let i = 0; i < this.nivelesDesc.length; i++) {      
      if(option == this.nivelesDesc[i]){
        index=i;
        break;
      }
    }

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

    /* Set the mployee's average variable */
    var value = !employee ? 0 : 1;
    var valueDesc = !employee ? '\'\'' : 'MediaEmpleado';
    this._QlikConnection.setNumValue('vL.MediaSel', value);
    this._QlikConnection.setStringValue('vL.MediaSelDesc', valueDesc);
    console.log("employee: ", employee);
    
    return employee;
  }

  /* Set the Top and Bottom fields */
  setTopBottom(topBottom, newTopBottom) {
    let top;
    let bottom;
    var tB;

    tB = topBottom === newTopBottom ? null : newTopBottom;
    top = tB === 'Top 20' ? 20 : 0;
    bottom = tB === 'Bottom 20' ? 20 : 0;

		console.log('Top: ',top+', Bottom: ',bottom);
		console.log('tB: ',tB);

    this._QlikConnection.setNumValue('vL.TopSel', top);
    this._QlikConnection.setNumValue('vL.BotSel', bottom);

    return tB;
  }
}
