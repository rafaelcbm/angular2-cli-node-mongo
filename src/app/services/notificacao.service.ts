import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class NotificacaoService {

    successMsg$: Observable<string>;
    private _successMsgSubject: Subject<string>;

    errorMsg$: Observable<string>;
    private _errorMsgSubject: Subject<string>;
    
    constructor() {
        this._successMsgSubject = <Subject<string>>new Subject();
        this.successMsg$ = this._successMsgSubject.asObservable();

        this._errorMsgSubject = <Subject<string>>new Subject();
        this.errorMsg$ = this._errorMsgSubject.asObservable();
    }

    sendSucessMessage(message:string) {
        this._successMsgSubject.next(message);
    }

    sendErrorMessage(message:string) {
        this._errorMsgSubject.next(message);
    }
}
