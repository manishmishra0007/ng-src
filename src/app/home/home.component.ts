import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    isAdmin: boolean;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.isAdmin = this.user.roleType === 1 ? true: false;
    }
}