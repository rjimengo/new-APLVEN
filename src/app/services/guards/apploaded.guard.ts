import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { ConnectionQlikService } from './../../services/connection-qlik.service';

@Injectable()
export class CanActivateAppLoad implements CanActivate {

    constructor(private router: Router, private _QlikConnection: ConnectionQlikService) { }

    async canActivate() {
        
        if (localStorage.getItem('appId')) {
            let appID= localStorage.getItem('appId');
            await this._QlikConnection.qlikConnection(appID);
            return true;
        }else{
            this.router.navigate(['/']);
            return false;
        }
    }
}