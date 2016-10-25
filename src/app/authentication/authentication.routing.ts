import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

import { AuthGuard }      from './auth-guard.service';
import { AuthService }    from './auth.service';

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
    ],
    providers: [
        AuthGuard,
        AuthService
    ]
})
export class AuthenticationRoutingModule { }