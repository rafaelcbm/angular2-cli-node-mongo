import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { routing } from './app.routing';

import { provideAuth } from "angular2-jwt";

@NgModule({
    declarations: [
        AppComponent, HomeComponent, RegisterComponent, LoginComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    providers: [
        provideAuth({
            globalHeaders: [{ "Content-type": "application/json" }],
            newJwtError: true,
            noTokenScheme: true
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
