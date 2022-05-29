import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, first } from 'rxjs/operators';

import { AccountService, AlertService, RequestService } from '@app/_services';
import { Status, Department, RequestTypes, Request, User } from '@app/_models';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    public statuses: Status[];
    public departments: Department[];
    public requestTypes: RequestTypes[];
    public approvers: User[];
    public onBehalfOf: User[];
    public assignedTo: User[];
    loggedInUserId: string;
    loggedInUserName: string;
    loggedinUser: User;
    @Input()
    requiredFileType:string;

    fileName = '';
    uploadProgress:number;
    uploadSub: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private requestService: RequestService,
        private http: HttpClient
    ) {
        this.loggedinUser = this.accountService.userValue;  
        this.loggedInUserId = this.loggedinUser.id; 
        let lastName: string;
        lastName = this.loggedinUser.lastName === null ? '' : this.loggedinUser.lastName 
        this.loggedInUserName = this.loggedinUser.firstName + ' ' + lastName;  
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;                

        this.form = this.formBuilder.group({
            memberId: [],
            onBehalfOf: [''],
            departmentId: ['', Validators.required],
            serviceRequestId: ['', Validators.required],
            serviceRequestName:['', Validators.required],
            serviceDescriptionName: [, Validators.required],
            assignedTo:[],
            isApprovalNeeded:[],
            approver: [],
            status: [],
            createdBy: []
        });        

        //Bind department dropdown
        this.accountService.getDepartmentMaster()
            .pipe(first())
            .subscribe(res => {
                this.departments = res; 
              });
              
        //Bind status dropdown
        this.requestService.getStatusMaster()
            .pipe(first())
            .subscribe(res => {
                this.statuses = res; 
              });

        //Bind role dropdown
        this.requestService.getRequestTypesMaster()
            .pipe(first())
            .subscribe(res => {
                this.requestTypes = res; 
              });

        //Bind approver
        this.accountService.getMemberByRoleType("4")
        .pipe(first())
        .subscribe(res => {
            this.approvers = res; 
        });

        //Bind on behalf of 
        this.accountService.getMemberByRoleType("2")
        .pipe(first())
        .subscribe(res => {
            this.onBehalfOf = res; 
        });

        //Bind assignedTo 
        this.accountService.getMemberByRoleType("3")
        .pipe(first())
        .subscribe(res => {
            this.assignedTo = res; 
        });


        if (!this.isAddMode) {
                this.requestService.getById(this.id)
                    .pipe(first())
                    .subscribe(x => this.form.patchValue(x.find(x => x.transactionId.toString() == this.id)));
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
            this.createRequest();
        } else {
            this.updateRequest();
        }
    }

    onFileSelected(event) {
        const file:File = event.target.files[0];
      
        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("thumbnail", file);

            const upload$ = this.http.post("/api/thumbnail-upload", formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                finalize(() => this.reset())
            );
          
            this.uploadSub = upload$.subscribe(event => {
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
              }
            })
        }
    }

    cancelUpload() {
        this.uploadSub.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = null;
        this.uploadSub = null;
    }

    private createRequest() {
        let request: Request = this.form.value;

        let memberId: string = this.loggedinUser.id;

        var data = {
            memberId : parseInt(this.loggedInUserId),
            onBehalfOf : request.onBehalfOf,
            departmentId : request.departmentId,
            serviceRequestId : request.serviceRequestId,
            serviceRequestName: request.serviceRequestName,
            status : request.status,
            assignedTo : request.assignedTo,
            isApprovalNeeded : false, // TODO
            approver : request.approver,
            serviceDescriptionName : request.serviceDescriptionName,  
            lastModifiedBy: parseInt(this.loggedInUserId) // TODO  
       }

        this.requestService.register(data as Request)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateRequest() {

        let request: Request = this.form.value;  

        var data = {
            transactionId: parseInt(this.id),
            memberId : request.memberId,
            onBehalfOf : request.onBehalfOf,
            departmentId : request.departmentId,
            serviceRequestId : request.serviceRequestId,
            serviceRequestName: request.serviceRequestName,
            status : request.status,
            assignedTo : request.assignedTo,
            isApprovalNeeded : false, // TODO
            approver : request.approver,
            serviceDescriptionName : request.serviceDescriptionName,  
            lastModifiedBy: request.memberId // TODO     
       }

        this.requestService.update(this.id, data as Request)
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