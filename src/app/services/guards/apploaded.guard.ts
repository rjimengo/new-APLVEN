import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { ConnectionQlikService } from './../../services/connection-qlik.service';

@Injectable()
export class CanActivateAppLoad implements CanActivate {

    constructor(private router: Router, private _QlikConnection: ConnectionQlikService) { }

    async canActivate() {
        
        let qlikAppId = document.getElementById("qlikAppId") as HTMLInputElement;  
        let appID= qlikAppId.value;
        if(appID){
            localStorage.setItem('appId', appID); 
        }

        if (localStorage.getItem('appId')) {
            if(this._QlikConnection.inicio){//Cuando pasa por la pantalla de inicio
                return true;
            }
            
            let appID= localStorage.getItem('appId');
            await this._QlikConnection.qlikConnection(appID);
            return true;
        }else{
            this.router.navigate(['/']);
            return false;
            
        }
    }
}