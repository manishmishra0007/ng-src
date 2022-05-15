import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Observable } from 'rxjs';
import { Department, Role, User } from '@app/_models';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    public departments: Department[];
    public roles: Role[];
    public managers: User[];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        this.departments = null;
    }

    ngOnInit() {

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required] ,
            lastName: ['', Validators.required],
            userName: ['', Validators.required],
            password: ['', passwordValidators],
            email:['', Validators.required],
            departmentId: [''],
            roleType:[''],
            location:[''],
            isAccountManager: [''],
            accountManager: [''],
            isGKPUser:['']
        });
                
        //Bind department dropdown
        this.accountService.getDepartmentMaster()
            .pipe(first())
            .subscribe(res => {
                this.departments = res; 
              });

        //Bind role dropdown
        this.accountService.getRoleMaster()
            .pipe(first())
            .subscribe(res => {
                this.roles = res; 
              });

        //Bind account manager dropdown
        this.accountService.getAllAccountManager()
            .pipe(first())
            .subscribe(res => {
                this.managers = res; 
                //console.log(res);
              });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x.find(x => x.id == this.id)));                                
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {

        let user: User = this.form.value;  

        var data = {
            id : user.id,
            firstName:user.firstName,
            lastName :user.lastName,
            departmentId : user.departmentId,
            departmentName : user.departmentName,
            roleType : user.roleType,
            roleName : user.roleName,
            email : user.email,
            userName : user.userName,
            password : user.password,
            location : user.location,
            //isGKPUser :  user.isGKPUser, // TODO
            //isAccountManager : user.isAccountManager,
            accountManager : user.accountManager,
            accountManagerName : user.accountManagerName
       }

        this.accountService.register(data as User)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {

        let user: User = this.form.value;  

        var data = {
            id : this.id,
            firstName:user.firstName,
            lastName :user.lastName,
            departmentId : user.departmentId,
            departmentName : user.departmentName,
            roleType : user.roleType,
            roleName : user.roleName,
            email : user.email,
            userName : user.userName,
            password : user.password,
            location : user.location,
            //isGKPUser :  user.isGKPUser, // TODO
            //isAccountManager : user.isAccountManager,
            accountManager : user.accountManager,
            accountManagerName : user.accountManagerName
       }

        this.accountService.update(this.id, data as User)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    
}