import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthenticationModule } from './authentication/authentication.module';
import { CommonPagesModule } from './common-pages/common-pages.module';
import { AuthGuard } from './authentication/auth-guard.service';
import { AuthService } from './authentication/auth.service';
import { ApiHttpService } from './services/api-http.service';
import { MessagesService } from './services/messages.service';

registerLocaleData(localePt);

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AuthenticationModule,
		SimpleNotificationsModule.forRoot(),
		CommonPagesModule,
		//O módulo AppRoutingModule precisa ser o último devido à rota '**' definida nele.
		AppRoutingModule
	],
	providers: [
		ApiHttpService,
		AuthService,
		AuthGuard,
		{ provide: LOCALE_ID, useValue: 'pt' },
		MessagesService],
	bootstrap: [AppComponent]
})
export class AppModule { }
