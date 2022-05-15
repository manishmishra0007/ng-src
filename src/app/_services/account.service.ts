import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Department, User, Role } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(userName, password) {

        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'POST'
            }
            );
        let options = { headers: headers };
        
        return this.http.post<User>(`${environment.apiUrl}/api/Members/authentication`, { userName, password }, options)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('JWTToken', user.token);
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        localStorage.removeItem('JWTToken');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };        
        return this.http.post(`${environment.apiUrl}/api/Members/AddMember`, user, options);
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
        return this.http.get<User[]>(`${environment.apiUrl}/api/Members/GetAllTeammembers`, options);
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
        return this.http.get<User[]>(`${environment.apiUrl}/api/Members/${id}`, options);
    }

    getMemberByRoleType(id: string) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        return this.http.get<User[]>(`${environment.apiUrl}/api/Members/GetAllTeammembersByRole?RoleId=${id}`, options);
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

        return this.http.post(`${environment.apiUrl}/api/Members/UpdateMember`, params, options)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        let headers = new HttpHeaders(
            {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'method': 'GET',
                'Authorization': localStorage.getItem('JWTToken')
            }
        );
        let options = { headers: headers };
        let ID = parseInt(id);
        return this.http.post(`${environment.apiUrl}/api/Members/DeleteMember?ID=${ID}`, ID, options)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
   
    getDepartmentMaster() { 
        let headers = new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'method': 'GET',
                            'Authorization': localStorage.getItem('JWTToken')
                        }
                    );
        let options = { headers: headers };

        return this.http.get<Department[]>(`${environment.apiUrl}/api/Master/GetAllDepartments`, options);
    } 

    getRoleMaster() { 
        let headers = new HttpHeaders(
                        {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'method': 'GET',
                            'Authorization': localStorage.getItem('JWTToken')
                        }
                    );
        let options = { headers: headers };

        return this.http.get<Role[]>(`${environment.apiUrl}/api/Master/GetAllRoles`, options);
    }
    
    getAllAccountManager() {
        let headers = new HttpHeaders(
                {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'method': 'GET',
                    'Authorization': localStorage.getItem('JWTToken')
                }
            );
        let options = { headers: headers };
        return this.http.get<User[]>(`${environment.apiUrl}/api/Members/GetAllAccountManager`, options);
    }
}