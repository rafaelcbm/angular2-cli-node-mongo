import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    //selector: 'home', // Também não necessita, já que é acessado pelo router.
    templateUrl: './home.component.html',
})
export class HomeComponent {


    constructor(
        private router: Router) {}

    gotoRegister() {
        let link = ['/register'];
        this.router.navigate(link);
    }

    gotoLogin() {
    	let link = ['/login'];
        this.router.navigate(link);
    }
}
