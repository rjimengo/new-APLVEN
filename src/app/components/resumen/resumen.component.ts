import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  constructor(private _QlikConnection: ConnectionQlikService) { }

  async ngOnInit() {
    this.mostrarGraficos();
    this.radioButtons();
  }

  mostrarGraficos(){
    //CAMBIAR VALOR A VARIABLE DE QLIK
    this._QlikConnection.Qlik.variable.getContent('vL.PorcentajeSel',function ( PorcentajeSel ){
      console.log("PorcentajeSel", PorcentajeSel);
    });
    this._QlikConnection.Qlik.variable.setNumValue('vL.PorcentajeSel',0);


    //Mostrar grafico
    this._QlikConnection.Qlik.getObject("LB01", 'kmVkg');


    //Mostrar KPI
    this._QlikConnection.Qlik.getObject("LB02", 'mJFNV');
    
    
    //Mostrar Filtro
    this._QlikConnection.Qlik.getObject("LB03", 'nkPmQA'); 


    this._QlikConnection.Qlik.getObject('calendario_escoger', 'VrCpHn')
  }

  changeOption(value){
    localStorage.setItem('optionValue', value);
  }

  radioButtons(){
    let radio = localStorage.getItem('optionValue');
    if(radio){
      this.setMetrica(radio);
      switch(radio) { 
        case "numero": { 
          let elem = document.getElementById("radioNumero") as HTMLInputElement;
          elem.checked = true;
           break; 
        } 
        case "importe": { 
          let elem = document.getElementById("radioImporte") as HTMLInputElement;
          elem.checked = true;
           break; 
        } 
        case "margen": { 
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
    switch (metric) {
      case 'numero':
        id = 1;
        abr = 'Num';
        break;
      case 'importe':
        id = 2;
        abr = 'Imp';
        break;
      case 'margen':
        id = 3;
        abr = 'Mar';
        break;
    };

    var unit = metric === 'Número' ? '#' : '€';
     
    this._QlikConnection.Qlik.variable.setNumValue('vL.IndicadorSel', id);
    this._QlikConnection.Qlik.variable.setStringValue('vL.IndicadorSelDesc', metric + ' (' + unit + ')');
    this._QlikConnection.Qlik.variable.setStringValue('vL.IndicadorSelAbr', abr);
    this._QlikConnection.Qlik.variable.setStringValue('vL.FormatoIndicador', '#.##0 ' + unit);


    // Disable % when metric = Margen
    if (metric === 'margen') {
      /* Reset % */
/*       $scope.percentage = commonFactory.initPercentage($rootScope.metric, $rootScope.operation, $rootScope.dimension, $rootScope.employee, null, true);
      $rootScope.percentage = $scope.percentage;
      $('#percentage').prop('checked', false); */
  }
  }

}
