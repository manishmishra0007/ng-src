import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const usersKey = 'angular-10-registration-login-example-users';
const registerKey = 'angular-10-registration-login-example-register';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
let requests = JSON.parse(localStorage.getItem(registerKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/requests/register') && method === 'POST':
                    return registerRequest();
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests();
                case url.match(/\/requests\/\d+$/) && method === 'GET':
                    return getRequestById();
                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function registerRequest() {
            const request = body
          
            request.id = requests.length ? Math.max(...requests.map(x => x.id)) + 1 : 1;
            requests.push(request);
            localStorage.setItem(registerKey, JSON.stringify(requests));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users.map(x => basicDetails(x)));
        }

        function getRequests() {
            if (!isLoggedIn()) return unauthorized();
            return ok(requests.map(x => basicDetailsRequests(x)));
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(basicDetails(user));
        }

        function getRequestById() {
            if (!isLoggedIn()) return unauthorized();

            const request = requests.find(x => x.id === idFromUrl());
            return ok(basicDetailsRequests(request));
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }

        function updateRequest() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let request = requests.find(x => x.id === idFromUrl());           

            // update and save user
            Object.assign(request, params);
            localStorage.setItem(registerKey, JSON.stringify(requests));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function getDepartments() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users.map(x => basicDetails(x)));
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user) {
            const { id, userName, firstName, lastName, email, departmentId, departmentName, roleType, roleName, location, isAccountManager, accountManager, accountManagerName, isGKPUser, dateCreated } = user;
            return { id, userName, firstName, lastName, email, departmentId, departmentName, roleType, roleName, location, isAccountManager, accountManager, accountManagerName, isGKPUser, dateCreated };
        }

        function basicDetailsRequests(request) {
            const { id, memberid, onbehalfof, departmentid, servicerequestid, servicerequestname, servicerequestdescription, assignedto, isapprovalneeded, approver, status, datecreated } = request;
            return { id, memberid, onbehalfof, departmentid, servicerequestid, servicerequestname, servicerequestdescription, assignedto, isapprovalneeded, approver, status, datecreated };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};