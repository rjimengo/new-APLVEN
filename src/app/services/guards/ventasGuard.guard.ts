import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class ventasGuard implements CanActivate {

    constructor() { }

    async canActivate() {

/*         let url = window.location.pathname.toString().split("/"); 
        let app = localStorage.getItem('app');

        console.log("url", window.location.pathname);
        console.log("app", app);
        
        if( app && app == url[0]){
            return true;
        }else{
            return false;
        } */
        
        return true;

    }
}