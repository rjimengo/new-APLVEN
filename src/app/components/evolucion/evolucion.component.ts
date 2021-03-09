import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { cancelaciones, indicadoresVCN, netos, sales, resumen } from 'src/config/ventasGlobalIDs';

@Component({
  selector: 'app-evolucion',
  templateUrl: './evolucion.component.html',
  styleUrls: ['./evolucion.component.css']
})
export class EvolucionComponent implements OnInit {

  metric:string = "Número";
  option:string = "Ventas";
  topBottomOpt;
  topBottom;

  objetos;
  dimensions;
  dimensionSel;
  optionSel;
  options;
  level;
  
  maxGrafica:boolean = false;
  vista:boolean = false;
  
  employeeAvg = this._ComunService.employeeAvg;
  employee;

  percentage;

  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService) { }

  ngOnInit() {
    this.cargarDatos();
    this._ComunService.radioButtons(null);   
    this._ComunService.radioButtons2(null);   
    this.metric = localStorage.getItem("metric");

    //Se obtienen todas las dimensiones, y se inicializa a Sin dimension
    this.dimensions = this._ComunService.dimensions;
    this.dimensionSel=this.dimensions[0];

    //Se obtienen las opciones de y se inicializa a la primera, Sin dimension
    this.options = this._ComunService.selectors[0];
    this.optionSel = this._ComunService.selectors[0][0];
    
    //this.level = this._ComunService.selectors[1];

    //Se obtienen los valores de los textos de los botones Top y Bottom
    this.topBottomOpt =this._ComunService.topBottomOpt;

    //Se inicializa el employee
    this.employee = this._ComunService.initEmployee(this.employee, this.percentage, false, this.dimensionSel=='Centros');
  }

  cargarDatos(){
    /* Get KPIs Ventas, Cancelaciones y Netos  */
      this._QlikConnection.getObject(sales[0].div, sales[0].id);
      this._QlikConnection.getObject(cancelaciones[0].div, cancelaciones[0].id);
      this._QlikConnection.getObject(netos[0].div, netos[0].id);

      this.objetos = resumen;
      this._QlikConnection.getObject("chart1", this.objetos.chart1[0]);
  }

  changeOption(value){
    this._ComunService.radioButtons(value);
    this.metric = value;
  }
  changeOption2(value){
    this._ComunService.radioButtons2(value);
    this.option = value;
  }

  dimensionSelectedSinDimension(i){
    if(i==0){
      this.dimensionSel=this.dimensions[i];
      this.options = this._ComunService.selectors[i];      
      this.optionSel = "Sin dimensión";    
      
      this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
      this.topBottom = this._ComunService.setTopBottom(null, null);

      this.setObjects_1();
    }
  }

  dimensionSelected(i){    
    //Seleccionamos la dimesion activa y obtenemos sus options, o niveles
    this.dimensionSel=this.dimensions[i];
    this.options = this._ComunService.selectors[i];

    //Si la dimension no es Centros
    if (this.dimensionSel != this.dimensions[1]) {
      /* Reset Employee */
      this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
  }

    this.setObjects_1();
    //this.setObjects_2(); TODO
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
    this.setObjects_1();
    /*this.setObjects_2(); */

}

/* Set top chart/table1 objects dynamically */
setObjects_1() {
  this._ComunService.setObjects_1(this.vista, this.dimensionSel, this.topBottom, this.objetos);
}

  maximizar(){
    this.maxGrafica = this._ComunService.maximizar(this.maxGrafica);
  }
  /* Switch between chart and table view */
  changeView(apartado){  
    this.vista = this._ComunService.changeView(apartado, this.vista, null, null);    
  }
  
  exportExcell(grafica){
    let graf = grafica as HTMLInputElement;
    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }
}
