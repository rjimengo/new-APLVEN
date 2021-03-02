import { Component, OnInit } from '@angular/core';
import { ConnectionQlikService } from 'src/app/services/connection-qlik.service';
import { urlAyuda } from 'src/config/config';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  forwardDisabled=true;
  backDisabled=true;

  bookmarkData=[{name:"nombre",id:"001"},{name:"Rutas de otro",id:"002"}];

  constructor( private _QlikConnection: ConnectionQlikService) { }

  ngOnInit() {
    //Cuando se cargue la aplicacion y se quite el loader se lanzara esta funcion
    setTimeout(() => {
      this.disabled();
    }, 8000);
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
    this._QlikConnection.qApp.getList('BookmarkList', function (reply) {
        var tempBookmarkData = [];

        for (var i = 0; i < reply.qBookmarkList.qItems.length; i++) {
            tempBookmarkData.push({
                id: reply.qBookmarkList.qItems[i].qInfo.qId,
                name: reply.qBookmarkList.qItems[i].qData.title
            });
        }
        this.bookmarkData = tempBookmarkData;
    });
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
  var element = document.getElementsByClassName("dropdown-bookmark")[0] as HTMLElement;

  if(element.classList.contains("show")){
    element.classList.remove("show");
  }else{
    element.classList.add("show");
  }

}

removeBookmark(id){
console.log("bookmark id: ", id);

}

onBookmarkContainerLeave(){
  setTimeout(() => {
    this.openCloseBookmark();
    this.closeAddBookmark();
  }, 1000);

}

onRemoveBookmarkEnter(i){
  var btnTrash = document.getElementsByClassName("fa-trash-alt")[i] as HTMLInputElement;
  btnTrash.style.display="block";
}
onRemoveBookmarkLeave(i){
  var btnTrash = document.getElementsByClassName("fa-trash-alt")[i] as HTMLInputElement;
  btnTrash.style.display="none";

}

}
