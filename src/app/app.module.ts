import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommonPagesModule } from './common-pages/common-pages.module';
import { AuthService } from './authentication/auth.service';

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
    providers: [  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
