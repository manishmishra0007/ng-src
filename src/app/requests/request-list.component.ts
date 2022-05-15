import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RequestService } from '@app/_services';

@Component({ templateUrl: 'request-list.component.html' })
export class RequestListComponent implements OnInit {
    requests = null;

    constructor(private requestService: RequestService) {}

    ngOnInit() {
        this.requestService.getAll()
            .pipe(first())
            .subscribe(requests => this.requests = requests);
    }
 
}