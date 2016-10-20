import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ContasRoutingModule } from './contas.routing';

import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [
        ManageContasComponent, DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ContasRoutingModule
    ],
    providers: []
})
export class ContasModule { }
