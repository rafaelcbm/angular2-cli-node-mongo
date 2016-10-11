import { Component, OnInit }            from '@angular/core';
import { Router }                       from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'main.component.html'
})
export class MainComponent implements OnInit {

    constructor( private router: Router ) { }

    public status:{isopen:boolean} = {isopen: false};
    public addToggleClass:boolean = false;

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    ngOnInit(): void {}
}
