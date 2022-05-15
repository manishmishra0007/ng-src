import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Request, RequestTypes, Status } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private requestSubject: BehaviorSubject<Request>;
    public request: Observable<Request>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.requestSubject = new BehaviorSubject<Request>(JSON.parse(localStorage.getItem('request')));
        this.request = this.requestSubject.asObservable();
    }

    public get requestValue(): Request {
        return this.requestSubject.value;
    }

    register(request: Request) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.post(`${environment.apiUrl}/api/ServiceRequest/AddServiceRequest`, request, options);
    }

    getAll() {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.get<Request[]>(`${environment.apiUrl}/api/ServiceRequest/GetAllServiceRequest`, options);
    }

    getById(id: string) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.get<Request[]>(`${environment.apiUrl}/api/ServiceRequest/${id}`, options);
    }

    update(id, params) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.post(`${environment.apiUrl}/api/ServiceRequest/UpdateServiceRequest`, params, options)
            .pipe(map(x => {                
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/requests/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.requestValue.id) {   
                    // To Do                 
                    //this.logout();
                }
                return x;
            }));
    }

    getStatusMaster() {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.get<Status[]>(`${environment.apiUrl}/api/Master/GetAllSttaus`, options);
    }

    getRequestTypesMaster() { 
        let headers = new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'method': 'GET',
                            'Authorization': localStorage.getItem('JWTToken')
                        }
                    );
        let options = { headers: headers };

        return this.http.get<[RequestTypes]>(`${environment.apiUrl}/api/Master/GetServiceRequestTypes`, options);
    }
}