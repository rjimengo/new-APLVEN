import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { configQlik, urlAyuda } from 'src/config/config';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ComunesService } from 'src/app/services/comunes.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  forwardDisabled=true;
  backDisabled=true;

  static bookmarkDataAux;
  bookmarkData;

  page;

  size;
  isAdministrador;
  isBiuser;
  isJerarquico;
  isVidacaixa;
  isSegurcaixa;

  personalSheets;
  isPersonalSheets;

  constructor( private _QlikConnection: ConnectionQlikService, private router:Router, private _ComunesService: ComunesService) { }

  ngOnInit() {
    //Cuando se termine la conexion con qlik
    this._QlikConnection.getAppLoaded().subscribe((loaded) => {
      if(loaded){//Si la conexion de la appQlik esta cargada
        this.disabled();
        this.updateBookmarkData();
        console.log("FINISH qlik conexion");
        this._ComunesService.loadPersonalSheets();
      }
    });

    setInterval(() => {
      if(this._QlikConnection.qApp)
        this.disabled();
    }, 1000);

    //variable para comprobar si mostrar el icono de cambiar app, solo se mostrara si el usuario tiene mas de 1 rol
    let sizeId = document.getElementById("size") as HTMLInputElement;
    if(sizeId)
      this.size = sizeId.value;

    let isAdministradorId = document.getElementById("isAdministrador") as HTMLInputElement; 
    if(isAdministradorId)
      this.isAdministrador = isAdministradorId.value;
    
    let isBiuserId = document.getElementById("isBiuser") as HTMLInputElement;  
    if(isBiuserId)
      this.isBiuser = isBiuserId.value;

    let isJerarquicoId = document.getElementById("isJerarquico") as HTMLInputElement;  
    if(isJerarquicoId)
      this.isJerarquico = isJerarquicoId.value;

    let isVidacaixaId = document.getElementById("isVidacaixa") as HTMLInputElement;  
    if(isVidacaixaId)
      this.isVidacaixa = isVidacaixaId.value;

    let isSegurcaixaId = document.getElementById("isSegurcaixa") as HTMLInputElement;  
    if(isSegurcaixaId)
      this.isSegurcaixa = isSegurcaixaId.value;
  }

  backFilter(){
    if(!this.backDisabled){
      var selState = this._QlikConnection.qApp.selectionState();
      if (selState.backCount > 0) {
        this._QlikConnection.qApp.back();
      }
    }
    this.disabled();
  }

  forwardFilter(){
    console.log("foward");
    
    if(!this.forwardDisabled){
      var selState = this._QlikConnection.qApp.selectionState();
      if (selState.forwardCount > 0) {
        this._QlikConnection.qApp.forward();
      }
    }
    this.disabled();
  }


  disabled(){
    var selState = this._QlikConnection.qApp.selectionState();

    setTimeout(() => {
      if(selState.backCount <= 0){
        this.backDisabled=true;
      }else
        this.backDisabled=false;
  
      if(selState.forwardCount <= 0){
        this.forwardDisabled=true;
      }else
        this.forwardDisabled=false;
    }, 200);
  }

  openHelp(){
    window.open(urlAyuda, '_blank');

  }

  /* Bookmark */
  updateBookmarkData() {
    //Ordenar alfabeticamente           TODO
    this._QlikConnection.qApp.getList('BookmarkList', function (reply) {
        var tempBookmarkData = [];

        for (var i = 0; i < reply.qBookmarkList.qItems.length; i++) {
            tempBookmarkData.push({
                id: reply.qBookmarkList.qItems[i].qInfo.qId,
                name: reply.qBookmarkList.qItems[i].qData.title
            });
        }
        FiltersComponent.bookmarkDataAux=tempBookmarkData;

    });
    setTimeout(() => {
      this.bookmarkData = FiltersComponent.bookmarkDataAux;
      if(this.bookmarkData)
        this.bookmarkData.sort((a,b) => a.name.localeCompare(b.name));      
    }, 400);

  }

  createBookmark(name) {

    if (name && name != '') {
        console.log('Selections before create bookmark: ', this._QlikConnection.qApp.selectionState().selections);
        this._QlikConnection.qApp.bookmark.create(name, '').then(function (reply) {
            
        });
    } 
    let inputNuevoBookmark = document.getElementById("nameNewBookmarkId") as HTMLInputElement;  
    inputNuevoBookmark.value = "";
    this.updateBookmarkData();
  }

  removeBookmark(bookmarkId) {
    this._QlikConnection.qApp.bookmark.remove(bookmarkId);
    this.updateBookmarkData();
  }

  updateBookmark(bookmark){
    this.removeBookmark(bookmark.id);
    this.createBookmark(bookmark.name);
  }
  loadBookmark(bookmarkId) {
    this._QlikConnection.qApp.bookmark.apply(bookmarkId);
    this.disabled();

  }

  openAddBookmark(){
    var element = document.getElementById("bookmark-add-container");
    element.style.display = "block"; 

    var btnMinus = document.getElementsByClassName("fa-minus-square")[0] as HTMLInputElement;
    btnMinus.style.display = "block";

    var btnPlus = document.getElementsByClassName("fa-plus-square")[0] as HTMLInputElement;
    btnPlus.style.display = "none"; 

  }
  closeAddBookmark(){
    var element = document.getElementById("bookmark-add-container");
    element.style.display = "none"; 

    var btnMinus = document.getElementsByClassName("fa-minus-square")[0] as HTMLInputElement;
    btnMinus.style.display = "none";

    var btnPlus = document.getElementsByClassName("fa-plus-square")[0] as HTMLInputElement;
    btnPlus.style.display = "block"; 


  }

  openCloseBookmark(){
    this.updateBookmarkData();
    
    var element = document.getElementsByClassName("dropdown-bookmark")[0] as HTMLElement;

    if(element.classList.contains("show")){
      element.classList.remove("show");
    }else{
      element.classList.add("show");
    }

  }

  onBookmarkContainerLeave(){
    setTimeout(() => {
      this.openCloseBookmark();
      this.closeAddBookmark();
    }, 1000);

  }

  onRemoveBookmarkEnter(i){
    var btnTrash = document.getElementsByClassName("fa-trash-alt")[i] as HTMLInputElement;
    var btnSave = document.getElementsByClassName("fa-save")[i] as HTMLInputElement;
    btnTrash.style.display="block";
    btnSave.style.display="block";
  }
  onRemoveBookmarkLeave(i){
    var btnTrash = document.getElementsByClassName("fa-trash-alt")[i] as HTMLInputElement;
    var btnSave = document.getElementsByClassName("fa-save")[i] as HTMLInputElement;
    btnTrash.style.display="none";
    btnSave.style.display="none";

  }


  getPage(){
    let url = window.location.pathname.split("/");
    if(url[url.length-1] != ""){
      this.page=url[url.length-2];
    }
  }

  async openApp(aplicacion){        

    this.page=aplicacion;
    
    let loaderHTML = document.getElementById("loader") as HTMLInputElement;  
    loaderHTML.style.display="block"; 
    
    if(!aplicacion){
      let select = document.getElementById("navigation") as HTMLInputElement;
      aplicacion=select[0].value;
    }
    let IDapp;
    localStorage.setItem('app', aplicacion);  


    let url = window.location.pathname.split("/");
    let pestanya;
    if(url[url.length-1] != ""){
      pestanya=url[url.length-1];
    }
/*     if(await this._QlikConnection.qlikConnection(IDapp)){
      localStorage.setItem('appId', IDapp); 
      this.router.navigate([aplicacion + '/' + pestanya]);      
    }  */
    window.location.href = "/" + aplicacion + "/" + pestanya;

  }


  openFiltersView(){//Abrir el buscador y clickar en Selecciones
    let buscador = document.getElementById("buscadorId") as HTMLInputElement;  
    if(buscador)
      buscador.click();
    var qvGlobalSelButton = document.getElementsByClassName('qv-subtoolbar-button qv-explore-selections-btn toggle-button borderbox')[0] as HTMLInputElement;
    if(qvGlobalSelButton)
      qvGlobalSelButton.click();
  }


  openQlikApp(){
    var config = configQlik;
    let prefix= config.prefix;
    if(prefix == ""){
      prefix="/";
    }
    var appUrl = (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') +
        prefix + 'sense/app/' + localStorage.getItem("appId");

    window.open(appUrl, '_blank');
  }

  autoserviceEnabled(){
    let autoserviceID = document.getElementById("autoservice") as HTMLInputElement;  
    let autoservice = autoserviceID.value;
    return (autoservice == 'enabled');
  }

  openCloseSheets(){  
    var element = document.getElementsByClassName("dropdown-sheets")[0] as HTMLElement;

    if(element.classList.contains("show")){
      element.classList.remove("show");
    }else{
      element.classList.add("show");
    }

  }

  onSheetsContainerLeave(){
    setTimeout(() => {
      this.openCloseSheets();
    }, 1000);

  }
  getPersonalSheets(){
    this.personalSheets = this._ComunesService.getPersonalSheets();
    this.isPersonalSheetsPopulated();
    return this.personalSheets;
  }
  isPersonalSheetsPopulated(){
    this.isPersonalSheets = this._ComunesService.isPersonalSheetsPopulated();
    return this.isPersonalSheets;
  }

  openQlikSheet(sheetId) {
    var config = configQlik;
    let prefix= config.prefix;
    if(prefix == ""){
      prefix="/";
    }
    var sheetUrl = (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') +
        prefix + 'sense/app/' + localStorage.getItem("appId") + '/sheet/' + sheetId;

    window.open(sheetUrl, '_blank');
  }

}
