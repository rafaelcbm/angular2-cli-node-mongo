import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../authentication/auth.service';

@Component({
    //Nao precisa de selector, já que é acessado pelo router.
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {}

    public disabled: boolean = false;
    public status: { isopen: boolean } = { isopen: false };

    public toggled(open: boolean): void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {}

    public logout() {

        this.authService.logout();

        this.router.navigate(['/home']);
    }
}
