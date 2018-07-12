import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ApiHttpService {

	constructor(private http: HttpClient, private authService: AuthService) { }

	get(url: string, requestOptions?: any): Observable<any> {

		if (this.authService.isLoggedIn()) {
			return this.http.get(url, requestOptions ? requestOptions : this.getRequestOptionsPadrao());
		}
	}

	post(url: string, payLoad: any, requestOptions?: any) {

		if (this.authService.isLoggedIn()) {
			return this.http.post(url, JSON.stringify(payLoad), requestOptions ? requestOptions : this.getRequestOptionsPadrao());
		}
	}

	delete(url: string, requestOptions?: any) {

		if (this.authService.isLoggedIn()) {
			return this.http.delete(url, requestOptions ? requestOptions : this.getRequestOptionsPadrao());
		}
	}

	put(url: string, payLoad: any, requestOptions?: any) {

		if (this.authService.isLoggedIn()) {
			return this.http.put(url, JSON.stringify(payLoad), requestOptions ? requestOptions : this.getRequestOptionsPadrao());
		}
	}

	getRequestOptionsPadrao() {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				"authorization": this.authService.getToken()
			})
		};

		return httpOptions;
	}
}
