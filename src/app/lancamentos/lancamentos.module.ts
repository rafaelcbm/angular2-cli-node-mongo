import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LancamentosRoutingModule } from './lancamentos.routing';

import { ManageLancamentosComponent } from './manage-lancamentos.component';
import { LancamentosListComponent } from './lancamentos-list.component';
import { LancamentosDetailComponent } from './lancamentos-detail.component';
import { LancamentosService } from '../services/lancamentos-service';

import { SimpleNotificationsModule } from "angular2-notifications";


@NgModule({
    declarations: [
        ManageLancamentosComponent,
        LancamentosListComponent,
        LancamentosDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        LancamentosRoutingModule,
        SimpleNotificationsModule.forRoot()
    ],
    providers: [
        LancamentosService
    ]
})
export class LancamentosModule {}
