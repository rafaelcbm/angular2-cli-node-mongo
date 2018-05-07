import { SimpleNotificationsModule } from 'angular2-notifications';
import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
  selector: 'my-ng2-app',
  template: `<router-outlet></router-outlet>
			<simple-notifications [options]="options"></simple-notifications>`
})
export class AppComponent implements OnInit {

	//SimpleNotifications configuration
	public options = {
		position: ["bottom", "right"],
		timeOut: 2000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
		lastOnBottom: true,
		maxStack:3
	};

  ngOnInit(): void {
    moment.locale('pt-BR');
  }
}
