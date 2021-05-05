import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-comparativa',
  templateUrl: './comparativa.component.html',
  styleUrls: ['./comparativa.component.css']
})
export class ComparativaComponent implements OnInit {

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
  
  maxGraficaTL:boolean = false;
  maxGraficaTR:boolean = false;
  maxGraficaBL:boolean = false;
  maxGraficaBR:boolean = false;

  vistaTopLeft:boolean = false;
  vistaTopRight:boolean = false;
  vistaBottomLeft:boolean = false;
  vistaBottomRight:boolean = false;
  
  employeeAvg = this._ComunService.employeeAvg;
  employee;

  percentage;

  promises=[];

  comparativeFilters:boolean = false;
  isRightCondition:boolean = false;

  comparativa;

  selecciones;

  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService) { }

  ngOnInit() {

    //Cuando se termine la conexion con qlik
    this._QlikConnection.getAppLoaded().subscribe((loaded) => {
      if(loaded){
        this._QlikConnection.selecciones$.subscribe(x =>{          
          this.selecciones=x;          
        });
        setInterval(() => {
          this.checkRightCondtion();
        }, 500);
      }
    });

    this.assignFilters();

    //Se obtienen todas las dimensiones, y se inicializa a Sin dimension
    this.dimensions = this._ComunService.dimensions;
    this.dimensionSel = this._ComunService.initDimension(this._ComunService.dimensionGlobal, 1); // 1 corresponde a Centros

    //Se obtienen las opciones de y se inicializa a la primera, Sin dimension
/*     this.options = this._ComunService.selectors[0];
    this.optionSel = this._ComunService.selectors[0][0]; */
    this.optionSel = this._ComunService.initOption(this.dimensionSel);

    //Se obtienen los valores de los textos de los botones Top y Bottom
    this.topBottomOpt =this._ComunService.topBottomOpt;

    //Se inicializa el employee
    this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);

    //Inicializar porcentaje
    this.percentage = this._ComunService.initPercentage(this.metric, this.option, this.dimensionSel, this.employee, null, true); //percentage siempre null en Comparativa

    //Inicializar TopBottom
    this.topBottom = this._ComunService.initTopBottom(this.topBottom == null, this._ComunService.topBottomGlobal);

    this.cargarDatos();

    this._ComunService.radioButtons(null, this.option, this.dimensionSel, this.employee);   
    this._ComunService.radioButtons2(null, this.metric, this.dimensionSel, this.employee);   
    this.metric = localStorage.getItem("metric");
    this.option = localStorage.getItem("optionValue2");
  }

  async cargarDatos(){

    //Obtener los objetos de la pestanya
    this.objetos = await this._ComunService.getObjetsIDs();
    this.comparativa = this.objetos.comparativa;
    this.objetos = this.objetos.comparativa.comp;
    

    /* Get Seleccionados (left) objects */
    for (var i = 0; i < this.comparativa.left.length; i++) {
      this.promises.push(this._QlikConnection.getObject(this.comparativa.left[i].div, this.comparativa.left[i].id)); 
    }

    /* Get Comparar con... (right) objects */
    for (var i = 0; i < this.comparativa.right.length; i++) {
      this.promises.push(this._QlikConnection.getObject(this.comparativa.right[i].div, this.comparativa.right[i].id)); 
    }

    /* Charts initialization */    
    if (this.dimensionSel != this.dimensions[0]) {
      this.setObjects("left"); 
      this.setObjects("right"); 
    }

    //Cuando todos los objetos se hayan cargado  
    this._ComunService.loadObjects(this.promises);
  }

  changeOption(value){
    this.percentage = this._ComunService.radioButtons(value, this.option, this.dimensionSel, this.employee);
    this.metric = value;
    this.setObjects("left");
    this.setObjects("right");
  }

  changeOption2(value){
    this._ComunService.radioButtons2(value, this.metric, this.dimensionSel, this.employee);
    this.option = value;
    this.setObjects("left");
    this.setObjects("right");
  }

  dimensionSelectedSinDimension(i, event){
    if(i==0){
      this.dimensionSel=this.dimensions[i];
      this._ComunService.dimensionGlobal = this.dimensions[i];
      this.options = this._ComunService.selectors[i];      
      this.optionSel = "Sin dimensión";    
      
      this.employee = this._ComunService.initEmployee(null, this.percentage, true, false);
      this.topBottom = this._ComunService.setTopBottom(null, null);
      this.percentage = this._ComunService.initPercentage(this.metric, this.option, this.dimensionSel, this.employee, null, true);

      this.setObjects("left");
      this.setObjects("right");
    }else{
      if(event.target.classList.contains("disabled-button")){
        return;
      }
      this.options = this._ComunService.selectors[i];
      this.dimensionSelected(i);
      this.setLevel(this.options[0]);
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

    //Se carga la grafica top y la grafica bottom tras cambiar la dimension
    this.setObjects("left");
    this.setObjects("right");
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
    this.setObjects("left");
    this.setObjects("right");

}

  /* Set bottom left chart/table objects dynamically */
  setObjects(side) {
    if (this.dimensionSel != this.dimensions[0]) {
        if (side == 'left' || (side == 'right' && this.isRightCondition)) {
            var div = 'chart2';
            if(side== 'left' && this.vistaBottomLeft){
              div = 'table2';
            }
            if(side== 'right' && this.vistaBottomRight){
              div = 'table2';
            }
            var id=0;
            switch (this.topBottom) {
                case null || undefined:
                    id = 0;
                    break;
                case 'Top 20':
                    id = 1;
                    break;
                case 'Bottom 20':
                    id = 2;
                    break;
            }
            
            return this._QlikConnection.getObject('chart2' + '-' + side, this.objetos[div + '_' + side][id]);
        }
    }
}

/* Check if the show confition is fulfilled */
checkRightCondtion() {
  var monthOrDate = false;
  var filterSelected = false;
  this.selecciones.forEach(sel => {
    if (sel.fieldName === '_FECHA C2' || sel.fieldName === '_MES C2') {
      monthOrDate = true;
    } else if (sel.fieldName.slice(-3) === ' C2') {
        filterSelected = true;
    }
  }); 

  if(monthOrDate && filterSelected && !this.isRightCondition){
    this.isRightCondition=true;

    //cargar graficas
    this.promises=[];
    for (var i = 0; i < this.comparativa.right.length; i++) {
      this.promises.push(this._QlikConnection.getObject(this.comparativa.right[i].div, this.comparativa.right[i].id)); 
    }
    this._ComunService.loadObjects(this.promises);
    this.setObjects("left");
    this.setObjects("right");


  }else if(!monthOrDate || !filterSelected){
    this.isRightCondition=false;

  }

}

  maximizar(apartado){
    switch(apartado){
      case "TL":
        this.maxGraficaTL = this._ComunService.maximizar(this.maxGraficaTL);
      break;
      case "TR":
        this.maxGraficaTR = this._ComunService.maximizar(this.maxGraficaTR);
      break;
      case "BL":
        this.maxGraficaBL = this._ComunService.maximizar(this.maxGraficaBL);
      break;
      case "BR":
        this.maxGraficaBR = this._ComunService.maximizar(this.maxGraficaBR);
      break;
    }
  }
  /* Switch between chart and table view */
  changeView(apartado){  
    switch(apartado){
      case "TL":
        this.vistaTopLeft = this._ComunService.changeView(apartado, this.vistaTopLeft, 11, 12);
      break;
      case "TR":
        this.vistaTopRight = this._ComunService.changeView(apartado, this.vistaTopRight, 11, 12);
      break;
      case "BL":
        this.vistaBottomLeft = !this.vistaBottomLeft;
        this.setObjects("left");
      break;
      case "BR":
        this.vistaBottomRight = !this.vistaBottomRight;
        this.setObjects("right");
      break;
    }
  }
  
  exportExcell(grafica){
    let graf;

    switch (grafica) {
      case "graficaTopLeft":
        graf = document.getElementById("chart-left") as HTMLInputElement; 
      break;
      case "graficaTopRight":
        graf = document.getElementById("chart-right") as HTMLInputElement; 
      break;
      case "graficaBottomLeft":
        graf = document.getElementById("chart2-left") as HTMLInputElement; 
      break;
      case "graficaBottomRight":
        graf = document.getElementById("chart2-right") as HTMLInputElement; 
      break;
    }

    this._QlikConnection.exportExcell(graf.getAttribute('qlikid'));
  }


  assignFilters() {
    if (!this.comparativeFilters) {
        var state = this._QlikConnection.globals.selState;
        
        this._QlikConnection.qApp.field('_RED C1').clear();
        this._QlikConnection.qApp.field('_DT C1').clear();
        this._QlikConnection.qApp.field('_DG C1').clear();
        this._QlikConnection.qApp.field('_DAN C1').clear();
        this._QlikConnection.qApp.field('_OFICINA C1').clear();
        this._QlikConnection.qApp.field('_OFICINAS VENTANILLA C1').clear();
        this._QlikConnection.qApp.field('_MES C1').clear();
        this._QlikConnection.qApp.field('_FECHA C1').clear();

        this._QlikConnection.qApp.field('_RED C2').clear();
        this._QlikConnection.qApp.field('_DT C2').clear();
        this._QlikConnection.qApp.field('_DG C2').clear();
        this._QlikConnection.qApp.field('_DAN C2').clear();
        this._QlikConnection.qApp.field('_OFICINA C2').clear();
        this._QlikConnection.qApp.field('_OFICINAS VENTANILLA C2').clear();
        this._QlikConnection.qApp.field('_MES C2').clear();
        this._QlikConnection.qApp.field('_FECHA C2').clear();

        for (var i in state.selections) {
            var fieldName = state.selections[i].fieldName;
            if (fieldName === 'RED' || fieldName === 'DT' || fieldName === 'DG' || fieldName === 'DAN' || fieldName === 'OFICINA' || fieldName === 'OFICINAS VENTANILLA' || fieldName === 'MES' || fieldName === 'FECHA') {
                var fieldSelectedValue = [];
                var fieldSelectedValueStr = '';
                for (var j in state.selections[i].selectedValues) {
                    var selectedValue = state.selections[i].selectedValues[j].qName;

                    if (fieldName === 'MES') {
                        var year = parseInt(selectedValue.substring(4, 6)) + 2000;
                        var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                        var monthIndex = months.indexOf(selectedValue.substring(0, 3)) + 1;

                        var monthSelected = parseInt(year + ('0' + monthIndex).slice(-2));
                        //console.log('Converted Mes: ' + monthSelected);

                        fieldSelectedValue.push(monthSelected);
                        fieldSelectedValueStr = monthSelected + ', ' + fieldSelectedValueStr;
                    } else if (fieldName === 'FECHA') {
                        //var dateValue = new Date(selectedValue.substring(6,10), selectedValue.substring(3,5), selectedValue.substring(0,2), 0, 0, 0, 0);
                        var dateSerial = this.dateToSerialNumber(parseInt(selectedValue.substring(0, 2)), parseInt(selectedValue.substring(3, 5)), parseInt(selectedValue.substring(6, 10)));

                        //var dateSerial = parseInt(dateToSerialNumber(dateValue));
                        //console.log('Converted Fecha :' + selectedValue + ' - ' + dateSerial);

                        fieldSelectedValue.push(dateSerial);
                        fieldSelectedValueStr = dateSerial + ', ' + fieldSelectedValueStr;

                    } else {
                        fieldSelectedValue.push(selectedValue);
                        fieldSelectedValueStr = '"' + selectedValue + '", ' + fieldSelectedValueStr;
                    }
                };
                this._QlikConnection.qApp.field('_' + fieldName + ' C1').selectValues(fieldSelectedValue, true, true);
                fieldSelectedValueStr = fieldSelectedValueStr.substring(0, fieldSelectedValueStr.length - 2);
                //console.log(fieldName + ': ' + fieldSelectedValueStr);
            }
        };
        this.comparativeFilters = true;
    }

    // Remove Centers and Date filters
    // No deben aplicarse estos filtros en esta pantalla
    this._QlikConnection.qApp.field('RED').clear();
    this._QlikConnection.qApp.field('DT').clear();
    this._QlikConnection.qApp.field('DG').clear();
    this._QlikConnection.qApp.field('DAN').clear();
    this._QlikConnection.qApp.field('OFICINA').clear();
    this._QlikConnection.qApp.field('OFICINAS VENTANILLA').clear();
    this._QlikConnection.qApp.field('MES').clear();
    this._QlikConnection.qApp.field('FECHA').clear();
}

dateValid(intDay, intMonth, intYear) {
  if ((intYear >= 1900 && intYear <= 2199) && (intMonth >= 1 && intMonth <= 12) &&
      (intDay >= 1 && intDay <= this.numberDaysInMonth(intMonth, intYear))) {
      return true;
  } else return false;
}

bissextileYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

numberDaysInYear(intYear) {
  if (this.bissextileYear(intYear)) return 366
  else return 365
}
numberDaysInMonth(intMonth, intYear) {
  return new Date(intYear, intMonth, 0).getDate();
}

dateToSerialNumber(intDay, intMonth, intYear) {

  if (!this.dateValid(intDay, intMonth, intYear))
      return 0;

  var serialNumber = 1;

  for (var i = 1900; i < intYear; i++)
      serialNumber += this.numberDaysInYear(i)

  for (var i = 1; i < intMonth; i++)
      serialNumber += this.numberDaysInMonth(i, intYear)

  return serialNumber + intDay
}

}
