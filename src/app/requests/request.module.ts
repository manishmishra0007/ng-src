import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { LayoutComponent } from './layout.component';
import { RequestListComponent } from './request-list.component';
import { AddEditComponent } from './add-edit.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RequestRoutingModule,
        MatIconModule
    ],
    declarations: [
        LayoutComponent,
        RequestListComponent,
        AddEditComponent
    ]
})
export class RequestModule { }