import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
              {
                    path: 'contas',
                    component: ManageContasComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            }

        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ContasRoutingModule { }