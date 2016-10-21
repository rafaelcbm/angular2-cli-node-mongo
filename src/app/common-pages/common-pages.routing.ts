import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'main',
                component: MainComponent
            },
            {
                path: 'contas',
                loadChildren: 'app/contas/contas.module#ContasModule',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CommonPagesRoutingModule { }