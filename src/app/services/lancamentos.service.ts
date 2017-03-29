import { Injectable } from '@angular/core';

import { NotificacaoService } from './notificacao.service';
import { DataService } from './data.service';
import { ApiHttpService } from './api-http.service';
import { Lancamento } from "../models/models.module";


@Injectable()
export class LancamentosService extends DataService<Lancamento> {

    constructor(apiHttp: ApiHttpService, notificacaoService: NotificacaoService) {
        
        super(apiHttp, notificacaoService);
        super.setApiBaseUrl('/api/lancamentos/');
    }
}
