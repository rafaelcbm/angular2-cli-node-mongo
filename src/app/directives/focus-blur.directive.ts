import { Directive, EventEmitter, Output, HostListener } from '@angular/core';

@Directive({
	selector: '[focus-blur-directive]'
})
export class FocusBlurDirective {

	@Output() onFocus: EventEmitter<boolean> = new EventEmitter<false>();
	@Output() onBlur: EventEmitter<boolean> = new EventEmitter<false>();

	@HostListener('focus', ['$event'])
	public onFocusTriggered(event: any): void {
		this.onFocus.emit(true);
	}

	@HostListener('blur', ['$event'])
	public onBlurTriggered(event: any): void {
		this.onBlur.emit(true);
	}
}
