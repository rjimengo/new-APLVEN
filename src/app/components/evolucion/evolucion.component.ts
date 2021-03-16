import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { cancelaciones, indicadoresVCN, netos, sales, resumen } from 'src/config/ventasGlobalIDs';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-evolucion',
  templateUrl: './evolucion.component.html',
  styleUrls: ['./evolucion.component.css']
})
export class EvolucionComponent implements OnInit {

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
  
  maxGrafica:boolean = false;
  maxGraficaBottom:boolean = false;
  vista:boolean = false;
  vistaB:boolean = false;
  
  employeeAvg = this._ComunService.employeeAvg;
  employee;

  percentage;

  promises=[];

  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.cargarDatos();
    this._ComunService.radioButtons(null, this.option, this.dimensionSel, this.employee);   
    this._ComunService.radioButtons2(null, this.metric, this.dimensionSel, this.employee);   
    this.metric = localStorage.getItem("metric");

    //Se obtienen todas las dimensiones, y se inicializa a Sin dimension
    this.dimensions = this._ComunService.dimensions;
    this.dimensionSel=this.dimensions[0];

    //Se obtienen las opciones de y se inicializa a la primera, Sin dimension
    this.options = this._ComunService.selectors[0];
    this.optionSel = this._ComunService.selectors[0][0];

    //Se obtienen los valores de los textos de los botones Top y Bottom
    this.topBottomOpt =this._ComunService.topBottomOpt;

    //Se inicializa el employee
    this.employee = this._ComunService.initEmployee(this.employee, this.percentage, false, this.dimensionSel=='Centros');

    //Inicializar porcentaje
    this.percentage = this._ComunService.initPercentage(this.metric, this.option, this.dimensionSel, this.employee, null, true);

  }

  cargarDatos(){
    this.spinner.show();
    if(this._QlikConnection.primeraCarga){//Si es la primera carga
      this.spinner.hide();
    }


    /* Get KPIs Ventas, Cancelaciones y Netos  */
    this.promises.push(this._QlikConnection.getObject(sales[0].div, sales[0].id));
    this.promises.push(this._QlikConnection.getObject(cancelaciones[0].div, cancelaciones[0].id));
    this.promises.push(this._QlikConnection.getObject(netos[0].div, netos[0].id));

    this.objetos = resumen;
    this.promises.push(this._QlikConnection.getObject("chart1", this.objetos.chart1[0]));

    
    //Cuando todos los objetos se hayan cargado    
    let count=0;

    this.promises.forEach(promesa => {
      promesa.then((model)=>{
        count++;
        if(count==this.promises.length){
          this._ComunService.setLoader("none"); 
          this.spinner.hide();
        }
      }).catch((err)=>{
        console.log("Se ha producido un error al cargar el objeto ", err);
        this._ComunService.setLoader("none"); 
        this.spinner.hide();
      });

    });
      
  }

  changeOption(value){
    this.percentage = this._ComunService.radioButtons(value, this.option, this.dimensionSel, this.employee);
    this.metric = value;
    this.setObjects_2();
  }

  changeOption2(value){
    this._ComunService.radioButtons2(value, this.metric, this.dimensionSel, this.employee);
    this.option = value;
    this.setObjects_2();
  }

  dimensionSelectedSinDimension(i){
    if(i==0){
      this.dimensionSel=this.dimensions[i];
      this.options = this._ComunService.selectors[i];      
      this.optionSel = "Sin dimensión";    
      
      this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
      this.topBottom = this._ComunService.setTopBottom(null, null);

      this.setObjects_1();
      this.setObjects_2();
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

    //Se carga la grafica top y la grafica bottom tras cambiar la dimension
    this.setObjects_1();
    this.setObjects_2();
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
    this.setObjects_2(); 

}

/* Set top chart/table1 objects dynamically */
setObjects_1() {
  this._ComunService.setObjects_1(this.vista, this.dimensionSel, this.topBottom, this.objetos);
}
/* Set top chart/table1 objects dynamically */
setObjects_2() {  
  this._ComunService.setObjects_2(this.vistaB, this.dimensionSel, this.topBottom, this.objetos, this.metric, this.option);
}

  maximizar(apartado){
    switch(apartado){
      case "graficaTop":
        this.maxGrafica = this._ComunService.maximizar(this.maxGrafica);
      break;
        case "graficaBottom":
        this.maxGraficaBottom = this._ComunService.maximizar(this.maxGraficaBottom);
      break;
    }
  }
  /* Switch between chart and table view */
  changeView(apartado){  
    let esB = apartado.split("_");    
    if(esB.length > 1){ //Si es la grafica de abajo
      this.vistaB = !this.vistaB;
      this.setObjects_2();
    }else{
      this.vista = !this.vista;
      this.setObjects_1();
    }
  }
  
  exportExcell(grafica){
    let graf = grafica as HTMLInputElement;
    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }
}
