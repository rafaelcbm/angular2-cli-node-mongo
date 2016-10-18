import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AuthenticationRoutingModule { }