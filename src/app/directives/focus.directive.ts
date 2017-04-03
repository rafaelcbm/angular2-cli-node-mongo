import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[focus]'
})
export class FocusDirective {

	@Input() focus: boolean;

	constructor(private element: ElementRef) { }

	ngOnChanges(changes: SimpleChanges) {
		if (this.focus) {
			this.element.nativeElement.focus();
		}
	}
}
