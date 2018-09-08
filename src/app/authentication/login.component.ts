import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthService } from './auth.service';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

	loginObservable$: Observable<any>;

	username: string;
	password: string;

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit() {
		// subscribe to the observable
		this.loginObservable$ = this.authService.loginObservable$;
		this.loginObservable$.subscribe((data) => this.loginHandler(data));
	}

	login(formValue) {
		this.authService.login(formValue);
	}

	loginHandler(data) {
		if (data.status === 'erro') {
			console.log('Mensagem de erro =', data.message);
			return;
		}

		if (this.authService.isLoggedIn()) {
			// Get the redirect URL from our auth service
			// If no redirect has been set, use the default
			const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'main/contas';
			// Redirect the user
			this.router.navigate([redirect]);
		}
	}

	logout(): void {
		this.authService.logout();
	}

	spotifySignIn() {
		this.authService.loginSpotify();
	}
}
