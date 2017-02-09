import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageLancamentosComponent } from './manage-lancamentos.component';
import { LancamentosListComponent } from './lancamentos-list.component';
import { LancamentosDetailComponent } from './lancamentos-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: '',
            component: ManageLancamentosComponent
        }])
    ],
    exports: [
        RouterModule
    ]
})
export class LancamentosRoutingModule { }
