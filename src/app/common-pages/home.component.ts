import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	// selector: 'home', // Também não necessita, já que é acessado pelo router.
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {


	constructor(
		private router: Router) { }

	gotoRegister() {
		const link = ['/register'];
		this.router.navigate(link);
	}

	gotoLogin() {
		const link = ['/login'];
		this.router.navigate(link);
	}
}
