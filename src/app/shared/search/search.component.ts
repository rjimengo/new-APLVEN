import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { }
  listeners:boolean=false;
  async ngOnInit() {
  }

  onSearchInputFocus(buscador){    
    let qso_CurrentSelections = document.getElementById("qso_CurrentSelections") as HTMLInputElement;

    if(qso_CurrentSelections.style.display != "block" || buscador.value!=""){//Si esta oculto, se pone visible
      qso_CurrentSelections.style.display = "block";
      var searchIcon = document.getElementsByClassName('lui-icon--selection-search')[0] as HTMLInputElement;
      if(searchIcon){//Se clicka en el vootn de buscar del objeto de qlik
        searchIcon.click();
        setTimeout(() => {//Se pone el foco en nuestro input buscador para escribir en el 
        }, 0);

        var inputSearchQlik = document.getElementsByClassName('lui-search__input')[0] as HTMLInputElement;
          
          ['change', 'keyup', 'input', 'paste'].forEach(event => {//Al escribir en nuestro buscador, se copia tambien en el de qlik
            inputSearchQlik.addEventListener(event, ()=>{
              buscador.value=inputSearchQlik.value;
            });
          });
      }

      if(!this.listeners){//Si los listener de eventos no se han inicializado aun

        var qvGlobalSearch = document.getElementsByClassName('qv-global-search-container')[0] as HTMLInputElement;
        var qvGlobalSel = document.getElementsByClassName('qv-subtoolbar-button qv-explore-selections-btn toggle-button borderbox')[0] as HTMLInputElement;

        qvGlobalSearch.addEventListener("DOMSubtreeModified", ()=>{ //Inicializar listener para cuando el buscador cambie
        var qvGlobalSel2 = document.getElementsByClassName('qv-gs-sections')[0] as HTMLInputElement;
          if(qvGlobalSearch.innerHTML=="" && qso_CurrentSelections.style.display == "block" && qvGlobalSel2==null){
            setTimeout(() => {
              buscador.value="";
              qso_CurrentSelections.style.display = "none";
            }, 200);
          }
  
        });
        
        qvGlobalSel.addEventListener('click', ()=>{//Se clicka en el boton de panel de selecciones y si es para quitarlo, se abre el buscador, si no, se ajusta el estilo
          var qvGlobalSel2 = document.getElementsByClassName('qv-gs-sections')[0] as HTMLInputElement;
          
          if(qvGlobalSel2==null){//Se quita el panel de selecciones
            //searchIcon.click(); si quisieramos poner el buscador
            buscador.value="";
            qso_CurrentSelections.style.display = "none";
          }else{
            //Ajustar el estilo del panel de selecciones dependiendo si el sidebar esta abierto o no
            if(document.getElementsByClassName("qv-global-selections-enabled")[0]){
              var qvSel = document.getElementsByClassName("qv-global-selections-enabled")[0].getElementsByClassName("qv-global-selections")[0] as HTMLElement; 
              if( document.getElementById("menu").style.marginLeft == "50px"){
                console.log("Cambio");
                qvSel.style.marginLeft = "50px";//Panel de selecciones
                qvSel.style.width = "calc(100% - 50px)";//Panel de selecciones  

              }else{
                
                qvSel.style.marginLeft = "225px";//Panel de selecciones
                qvSel.style.width = "calc(100% - 225px)";//Panel de selecciones
              }
            }
          }
        
        });

      }

    }

    this.listeners=true;
    buscador.value="";
  }

}
