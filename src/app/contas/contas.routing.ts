import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',                
                children:
                [
                     { path: 'main', component: ManageContasComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ContasRoutingModule { }