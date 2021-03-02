import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { sales, cancelaciones, netos } from '../../../config/ventasGlobalIDs'
@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})

export class ResumenComponent implements OnInit {
  
  metric:string = "Número";
  vistaVentas:boolean = false;
  vistaCancelaciones:boolean = false;
  vistaNeto:boolean = false;

  maxVentas:boolean = false;
  maxCancelaciones:boolean = false;
  maxNeto:boolean = false;
  
  constructor(
    private _QlikConnection: ConnectionQlikService,
    private _ComunService: ComunesService) { }
  
  async ngOnInit() {
    this.cargarDatos();
    this.radioButtons();   
    
  }

  cargarDatos(){
        
    /* Get Ventas objects */
    for (var i = 0; i < sales.length; i++) {
      this._QlikConnection.getObject(sales[i].div, sales[i].id);
    }
    /* Get Cancelaciones objects */
    for (var i = 0; i < cancelaciones.length; i++) {
      this._QlikConnection.getObject(cancelaciones[i].div, cancelaciones[i].id);
    }
    /* Get Netos objects */
    for (var i = 0; i < netos.length; i++) {
      this._QlikConnection.getObject(netos[i].div, netos[i].id);
    }

  }

  changeOption(value){
    localStorage.setItem('optionValue', value);
    this.radioButtons();
  }

  radioButtons(){
    let radio = localStorage.getItem('optionValue');
    if(radio){
      this.setMetrica(radio);
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
    this.metric = metric;
    
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
     
    //this._QlikConnection.setNumValue('vL.IndicadorSel', id);
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

    /* Switch between chart and table view */
  changeView(apartado){

    switch(apartado){
      case "ventas":
        this.vistaVentas = this._ComunService.changeView(apartado, this.vistaVentas, 5, 6);
      break;
      case "cancelaciones":
        this.vistaCancelaciones = this._ComunService.changeView(apartado, this.vistaCancelaciones, 5, 6);
      break;
      case "neto":
        this.vistaNeto = this._ComunService.changeView(apartado, this.vistaNeto, 5, 6);
      break;
    }
    
  }

  exportExcell(grafica){
    let graf = grafica as HTMLInputElement;
    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }

  maximizar(apartado){

    switch(apartado){
      case "ventas":
        this.maxVentas = this._ComunService.maximizar(apartado, this.maxVentas);
      break;
      case "cancelaciones":
        this.maxCancelaciones = this._ComunService.maximizar(apartado, this.maxCancelaciones);
      break;
      case "neto":
        this.maxNeto = this._ComunService.maximizar(apartado, this.maxNeto);
      break;
    }

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

  }

}
