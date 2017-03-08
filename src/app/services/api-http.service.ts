import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { AuthService } from '../authentication/auth.service';

@Injectable()
export class ApiHttpService {

    constructor(private http: Http, private authService: AuthService) { }

    get(url: string, requestOptions?: RequestOptions) : Observable<any>{

        if (this.authService.isLoggedIn()) {

            return this.http.get(url, requestOptions ? requestOptions : this.getRequestOptionsPadrao())
                .map((res: Response) => res.json());
        }
    }

    post(url: string, payLoad: any, requestOptions?: RequestOptions) {

        if (this.authService.isLoggedIn()) {

            return this.http.post(url, JSON.stringify(payLoad), requestOptions ? requestOptions : this.getRequestOptionsPadrao())
                .map((res: Response) => res.json());
        }
    }

    delete(url: string, requestOptions?: RequestOptions) {

        if (this.authService.isLoggedIn()) {

            return this.http.delete(url, requestOptions ? requestOptions : this.getRequestOptionsPadrao()).map((res: Response) => res.json());
        }
    }

    put(url: string, payLoad: any, requestOptions?: RequestOptions) {

        if (this.authService.isLoggedIn()) {

            return this.http.put(url, JSON.stringify(payLoad), requestOptions ? requestOptions : this.getRequestOptionsPadrao())
                .map((res: Response) => res.json());
        }
    }

    getRequestOptionsPadrao() {
        let requestOptions = new RequestOptions({
            headers: new Headers({ "Content-Type": "application/json", "authorization": this.authService.getToken() })
        });

        return requestOptions;
    }
}
