import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    isAdmin: boolean;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);

        this.accountService.user.subscribe(x => {
            if(x != null && x != undefined)
            {
                this.isAdmin = this.user.roleType === 1 ? true : false; //TODO
            }
        });
        
    }

    logout() {
        this.accountService.logout();
    }
}