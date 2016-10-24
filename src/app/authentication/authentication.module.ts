import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

import { AuthenticationRoutingModule } from './authentication.routing';
import { provideAuth } from "angular2-jwt";


@NgModule({
    declarations: [
        RegisterComponent, LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthenticationRoutingModule
    ],
    providers: [
        provideAuth({
            globalHeaders: [{ "Content-type": "application/json" }],
            noJwtError: true,
            noTokenScheme: true
        })
    ]
})
export class AuthenticationModule { }
