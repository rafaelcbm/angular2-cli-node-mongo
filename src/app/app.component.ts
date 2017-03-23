import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'my-ng2-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    moment.locale('pt-BR');
  }
}
