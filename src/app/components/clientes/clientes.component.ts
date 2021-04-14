import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { indicadoresVCN, clientes, cargo } from 'src/config/ventasGlobalIDs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  metric:string = "";
  option:string = "";
  topBottomOpt;
  topBottom;

  objetos;
  dimensions;
  dimensionSel;
  optionSel;
  options;
  level;
  
  maxGraficaEdad:boolean = false;
  maxGraficaProducServ:boolean = false;
  maxGraficaNegocio:boolean = false;
  maxGraficaSaldo:boolean = false;
  vistaEdad:boolean = false;
  vistaProducServ:boolean = false;
  vistaNegocio:boolean = false;
  vistaSaldo:boolean = false;
  
  employeeAvg = this._ComunService.employeeAvg;
  employee;

  percentage;

  promises=[];

  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService) { }

  ngOnInit() {
    //Se obtienen todas las dimensiones, y se inicializa a Sin dimension
    this.dimensions = this._ComunService.dimensions;
    //this.dimensionSel=this.dimensions[0];
    this.dimensionSel = this._ComunService.initDimension(this._ComunService.dimensionGlobal, 1); // 1 porque corresponde a Centros

    //Se obtienen las opciones de la primera dimension y se inicializa a la primera, Sin dimension
    this.optionSel = this._ComunService.initOption(this.dimensionSel);

    //Se obtienen los valores de los textos de los botones Top y Bottom
    this.topBottomOpt =this._ComunService.topBottomOpt;

    //Se inicializa el employee
    this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);

    //Inicializar porcentaje
    this.percentage = this._ComunService.initPercentage(this.metric, this.option, this.dimensionSel, this.employee, this._ComunService.percentageGlobal, false);

    //Inicializar TopBottom
    this._ComunService.topBottomGlobal = null;
    this.topBottom = this._ComunService.initTopBottom(this.topBottom == null, this._ComunService.topBottomGlobal);

    this.cargarDatos();

    this._ComunService.radioButtons(null, this.option, this.dimensionSel, this.employee);   
    this._ComunService.radioButtons2(null, this.metric, this.dimensionSel, this.employee);   
    this.metric = localStorage.getItem("metric");
    this.option = localStorage.getItem("optionValue2");
  }

  cargarDatos(){
    this.promises.push(this._QlikConnection.getObject('calendario_escoger', 'VrCpHn'));
    this.promises.push(this._QlikConnection.getObject('calendario_barra', 'jvJpb'));
    
    /* Get KPIs Ventas, Cancelaciones y Netos  */
    this.promises.push(this._QlikConnection.getObject(indicadoresVCN.ventas[0], indicadoresVCN.ventas[1]));
    this.promises.push(this._QlikConnection.getObject(indicadoresVCN.cancelaciones[0], indicadoresVCN.cancelaciones[1]));
    this.promises.push(this._QlikConnection.getObject(indicadoresVCN.neto[0], indicadoresVCN.neto[1])); 

    //Obtener los objetos de la pestanya
    this.objetos = clientes;

    /* Obtener las 4 graficas de la pestanya Clientes */
    for (var i = 0; i < this.objetos.length; i+=2) {
      this.promises.push(this._QlikConnection.getObject(this.objetos[i].div, this.objetos[i].id));
    }

    //Cuando todos los objetos se hayan cargado  
    this._ComunService.loadObjects(this.promises);
  }

  changeOption(value){
    this.percentage = this._ComunService.radioButtons(value, this.option, this.dimensionSel, this.employee);
    this.metric = value;
   }

  changeOption2(value){
    this._ComunService.radioButtons2(value, this.metric, this.dimensionSel, this.employee);
    this.option = value;
  }

  dimensionSelectedSinDimension(i){
    if(i==0){
      this.dimensionSel=this.dimensions[i];
      this._ComunService.dimensionGlobal = this.dimensions[i];
      this.options = this._ComunService.selectors[i];      
      this.optionSel = "Sin dimensión";    
      
      //this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
      //this.topBottom = this._ComunService.setTopBottom(null, null);
      this.percentage = this._ComunService.initPercentage(this.metric, this.option, this.dimensionSel, this.employee, null, true);

      //Se pasan todas las tablas a graficas
      this.vistaEdad = true;
      this.vistaProducServ = true;
      this.vistaNegocio = true;
      this.vistaSaldo = true;
      this.changeView("edad");
      this.changeView("producServ");
      this.changeView("negocio");
      this.changeView("saldo");

    }
  }

  dimensionSelected(i){    
    //Seleccionamos la dimesion activa y obtenemos sus options, o niveles
    this.dimensionSel=this.dimensions[i];
    this._ComunService.dimensionGlobal = this.dimensions[i];
    this.options = this._ComunService.selectors[i];
    
    //Si la dimension no es Centros
    if (this.dimensionSel != this.dimensions[1]) {
      /* Reset Employee */
      this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
    }

  }

  percentageSelected(checked){
    this.percentage= this._ComunService.setPercentage(checked);
  }


  dimPreSel(i){
    this.options = this._ComunService.selectors[i];
  }

  setLevel(option){
    this._ComunService.setLevel(option);
    this.optionSel = option;      
  }

  employeeSelected(){
    this.employee = this._ComunService.setEmployee(!this.employee);
  }

  topBottomSelected(index) {    
    this.topBottom = this._ComunService.setTopBottom(this.topBottom, this.topBottomOpt[index]);    
}

  maximizar(apartado){ 
    switch(apartado){
      case "edad":
        this.maxGraficaEdad = this._ComunService.maximizar(this.maxGraficaEdad);
      break;
      case "producServ":
        this.maxGraficaProducServ = this._ComunService.maximizar(this.maxGraficaProducServ);
      break;
      case "negocio":
        this.maxGraficaNegocio = this._ComunService.maximizar(this.maxGraficaNegocio);
      break;
      case "saldo":
        this.maxGraficaSaldo = this._ComunService.maximizar(this.maxGraficaSaldo);
      break;
    }
  }
  /* Switch between chart and table view */
  changeView(apartado){
    switch(apartado){
      case "edad":
        if(this.dimensionSel=="Sin dimensión" && !this.vistaEdad){
          return;
        }
        this.vistaEdad = this._ComunService.changeView(apartado, this.vistaEdad, 0, 1);
      break;
      case "producServ":
        if(this.dimensionSel=="Sin dimensión" && !this.vistaProducServ){
          return;
        }
        this.vistaProducServ = this._ComunService.changeView(apartado, this.vistaProducServ, 2, 3);
      break;
      case "negocio":
        if(this.dimensionSel=="Sin dimensión" && !this.vistaNegocio){
          return;
        }
        this.vistaNegocio = this._ComunService.changeView(apartado, this.vistaNegocio, 4, 5);
      break;
      case "saldo":
        if(this.dimensionSel=="Sin dimensión" && !this.vistaSaldo){
          return;
        }
        this.vistaSaldo = this._ComunService.changeView(apartado, this.vistaSaldo, 6, 7);
      break;
    }
  }
  
  exportExcell(grafica){
    let graf = grafica as HTMLInputElement;
    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }
}
