import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ContasRoutingModule } from './contas.routing';

import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';
import { ContasListComponent } from './contas-list.component';
import { ContasDetailComponent } from './contas-detail.component';
import { ContasService } from '../services/contas-service';

@NgModule({
    declarations: [
        ManageContasComponent,
        DashboardComponent,
        ContasListComponent,
        ContasDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ContasRoutingModule
    ],
    providers: [
        ContasService
    ]
})
export class ContasModule {}
