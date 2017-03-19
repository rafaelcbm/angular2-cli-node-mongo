import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthenticationRoutingModule } from './authentication.routing';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

@NgModule({
    declarations: [
        RegisterComponent, LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        AuthenticationRoutingModule
    ]
})
export class AuthenticationModule { }
