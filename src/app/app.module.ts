import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommonPagesModule } from './common-pages/common-pages.module';
import { AuthService } from './authentication/auth.service';
import { ApiHttpService } from './services/api-http.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AuthenticationModule,
        CommonPagesModule,
        //O módulo AppRoutingModule precisa ser o último devido à rota '**' definida nele.
        AppRoutingModule
    ],
    providers: [
        ApiHttpService,
        { provide: LOCALE_ID, useValue:'pt-BR' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
