import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    //Nao precisa de selector, já que é acessado pelo router.
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

    constructor(private router: Router) { }

    public status: { isopen: boolean } = { isopen: false };
    public addToggleClass: boolean = false;

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void { }

    login() {
        this.router.navigate(['/contas/main']);
    }
}
