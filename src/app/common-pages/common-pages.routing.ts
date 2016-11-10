import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';

import { AuthGuard } from '../authentication/auth-guard.service';



@NgModule({
    imports: [
        RouterModule.forChild([{
            path: 'home',
            component: HomeComponent
        }, {
            path: 'main',
            component: MainComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'contas',
                    loadChildren: 'app/contas/contas.module#ContasModule',
                },
                {
                    path: '',
                    redirectTo: 'contas',
                },
            ]
        }])
    ],
    exports: [
        RouterModule
    ]
})
export class CommonPagesRoutingModule { }
