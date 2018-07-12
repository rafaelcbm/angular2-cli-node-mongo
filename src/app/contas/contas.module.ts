import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ContasRoutingModule } from './contas.routing';
import { SharedDirectivesModule } from './../directives/shared-directives.module';
import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';
import { ContasListComponent } from './contas-list.component';
import { ContasDetailComponent } from './contas-detail.component';
import { ContasService } from '../services/contas.service';

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
        HttpClientModule,
        ContasRoutingModule,
		SharedDirectivesModule,
    ],
    providers: [
        ContasService
    ]
})
export class ContasModule {}
