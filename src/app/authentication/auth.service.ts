import { ContasModule } from './../contas/contas.module';

import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ENV } from '../services/env-config';
import { Observable, Observer } from 'rxjs';
import 'rxjs/Rx';

import { Router } from '@angular/router';
import { share } from 'rxjs/operators';

@Injectable()
export class AuthService {

	// expose to component
	loginObservable$: Observable<any>;
	registerObservable$: Observable<any>;

	private loginObserver: Observer<any>;
	private registerObserver: Observer<any>;
	private jwtHelper: JwtHelperService;


	// store the URL so we can redirect after logging in
	redirectUrl: string;

	constructor(private http: HttpClient, private router: Router) {
		this.loginObservable$ = new Observable(observer => this.loginObserver = observer);
		this.registerObservable$ = new Observable(observer => this.registerObserver = observer).pipe(share());
		this.jwtHelper = new JwtHelperService();
	}

	isLoggedIn() {
		if (this.getToken()) {
			return !this.jwtHelper.isTokenExpired(this.getToken());
		}
	}

	getToken() {
		return localStorage.getItem('id_token');
	}

	getUserName() {

		var token = this.getToken();

		if (token) {
			console.log("* Token utils:");
			console.log(
				this.jwtHelper.decodeToken(token),
				this.jwtHelper.getTokenExpirationDate(token),
				this.jwtHelper.isTokenExpired(token)
			);

			let userName = this.jwtHelper.decodeToken(token).userName;
			return userName;
		}

		return null;
	}

	login(userCredential) {
		//return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
		//this.isLoggedIn = true;

		this.http.post(`${ENV.HOST_URI}login`, JSON.stringify(userCredential), this.getHttpOptions())
			.subscribe(
				(data: any) => {
					console.log("Resposta /login:", data);

					if (data.status === "erro") {
						// put data into observavle
						this.loginObserver.next({
							status: data.status,
							message: data.message,
						});
					} else {
						localStorage.setItem("id_token", data.jwt);

						// put data into observavle
						this.loginObserver.next({
							status: data.status,
							jwt: data.jwt
						});
					}
				},
				(error: Error) => {
					console.log(error);
					// put data into observavle
					this.loginObserver.next({
						status: 'erro',
						message: 'Erro ao autenticar usuário!',
					})
				}
			);
	}

	signup(userCredential) {
		//return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
		//this.isLoggedIn = true;

		this.http.post(`${ENV.HOST_URI}signup`, JSON.stringify(userCredential), this.getHttpOptions())
			.subscribe(
				(data: any) => {
					console.log("Resposta / register:", data);
					if (data.status === "erro") {
						// put data into observavle
						this.registerObserver.next({
							status: data.status,
							message: data.message,
						});
					} else {
						localStorage.setItem("id_token", data.jwt);

						// put data into observavle
						this.registerObserver.next({
							status: data.status,
							jwt: data.jwt
						});
					}
				},
				(error: Error) => {
					console.log(error);
					// put data into observavle
					this.registerObserver.next({
						status: 'erro',
						message: 'Erro ao registrar novo usuário!',
					})
				}
			);
	}

	logout() {
		localStorage.removeItem("id_token");
	}

	loginSpotify() {

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			})
		};


		this.http.get(`${ENV.HOST_URI}login-spotify`, httpOptions)
			.subscribe(
				(res: HttpResponse<any>) => window.open(res.url, '_self'),
				(error: Error) => {
					console.log(error);
					// put data into observavle
					this.loginObserver.next({
						status: 'erro',
						message: 'Erro ao autenticar usuário Spotify!',
					})
				}
			);
	}

	adicionarTokenSpotifyUser(token) {
		localStorage.setItem("id_token", token);
	}

	getHttpOptions() {
		return {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			})
		};
	}
}
