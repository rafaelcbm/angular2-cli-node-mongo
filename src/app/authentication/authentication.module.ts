import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

import { SharedDirectivesModule } from './../directives/shared-directives.module';
import { AuthenticationRoutingModule } from './authentication.routing';
import { CategoriasService } from './../services/categorias.service';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';

@NgModule({
    declarations: [
        RegisterComponent, LoginComponent
    ],
    imports: [
		JwtModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AuthenticationRoutingModule,
		SharedDirectivesModule,
    ],
    providers: [
		CategoriasService,
		JwtHelperService
    ]
})
export class AuthenticationModule { }
