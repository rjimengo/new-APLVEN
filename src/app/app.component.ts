import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'APLVEN';

  @ViewChild('buscador') searchElement: ElementRef;
  
  focusBuscador(){
/*     console.log(this.searchElement);
    
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.searchElement.nativeElement.focus();
    },0);  

    
 */
  }
}

