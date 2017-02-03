import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageContasComponent } from './manage-contas.component';
import { DashboardComponent } from './dashboard.component';
import { ContasListComponent } from './contas-list.component';
import { ContasDetailComponent } from './contas-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: '',
            component: ManageContasComponent,
            children: [{
                path: '',
                component: ContasListComponent,
                children: [
                {
                    path: 'new',
                    component: ContasDetailComponent
                }, 
                {
                    path: ':id',
                    component: ContasDetailComponent
                }, 
                {
                    path: ''
                }]
            }]
        }])
    ],
    exports: [
        RouterModule
    ]
})
export class ContasRoutingModule {}
