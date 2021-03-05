import { Component, OnInit } from '@angular/core';
import { ComunesService } from 'src/app/services/comunes.service';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { cancelaciones, netos, sales } from 'src/config/ventasGlobalIDs';

@Component({
  selector: 'app-evolucion',
  templateUrl: './evolucion.component.html',
  styleUrls: ['./evolucion.component.css']
})
export class EvolucionComponent implements OnInit {

  metric:string = "Número";
  dimensions;
  dimensionSel;
  options;
  level;
  employeeAvg = this._ComunService.employeeAvg;
  constructor(private _QlikConnection: ConnectionQlikService, private _ComunService: ComunesService) { }

  ngOnInit() {
    this.cargarDatos();
    this._ComunService.radioButtons(null);   
    this._ComunService.radioButtons2(null);   
    this.metric = localStorage.getItem("metric");
    //this.metric = localStorage.getItem("metric");

    this.dimensions = this._ComunService.dimensions;
    this.dimensionSel=this.dimensions[0];

    this.options = this._ComunService.selectors[0];
    //this.level = this._ComunService.selectors[1];
  }

  cargarDatos(){
        
    /* Get Ventas objects */
      this._QlikConnection.getObject(sales[0].div, sales[0].id);
    /* Get Cancelaciones objects */
      this._QlikConnection.getObject(cancelaciones[0].div, cancelaciones[0].id);
    /* Get Netos objects */
      this._QlikConnection.getObject(netos[0].div, netos[0].id);

  }

  changeOption(value){
    this._ComunService.radioButtons(value);
    this.metric = value;
  }
  changeOption2(value){
    this._ComunService.radioButtons2(value);
    //this.metric = value;
  }

  dimensionSelected(i){

    this.dimensionSel=this.dimensions[i];
    this.options = this._ComunService.selectors[i];
    
  }
  setLevel(option){
    this._ComunService.setLevel(option);
  }

  employeeSelected(){
    
  }


    /* Set the Top and Bottom fields */
    setTopBottom(topBottom, newTopBottom, isRanking) {
/*       var top;
      var bottom;
      var tB;
      if (isRanking) {
          tB = newTopBottom;
          top = tB === 'Top 50' ? 50 : 0;
          bottom = tB === 'Bottom 50' ? 50 : 0;
      } else {
          tB = topBottom === newTopBottom ? null : newTopBottom;
          top = tB === 'Top 20' ? 20 : 0;
          bottom = tB === 'Bottom 20' ? 20 : 0;
      }
      aapp.obj.app.variable.setNumValue('vL.TopSel', top);
      aapp.obj.app.variable.setNumValue('vL.BotSel', bottom);
  
      console.log('Top: '+[top]+', Bottom: '+[bottom]);
  
      return tB; */
  };
}
