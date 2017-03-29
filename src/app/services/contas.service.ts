import { Injectable } from '@angular/core';

import { NotificacaoService } from './notificacao.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Conta } from "../models/models.module";


@Injectable()
export class ContasService extends DataService<Conta> {

    constructor(apiHttp: ApiHttpService, notificacaoService: NotificacaoService) {
        
        super(apiHttp, notificacaoService);
        super.setApiBaseUrl('/api/contas/');
    }
}
