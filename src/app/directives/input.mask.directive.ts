import { Log } from './../util/log';
import { Directive, Input, ElementRef, SimpleChanges } from '@angular/core';
import { NgControl } from "@angular/forms";

declare let $: any;

@Directive({
	selector: '[input-mask]',
	host: {
		"(blur)": "change()",
		"(keyup)": "change()"
	}
})
export class InputMaskDirective {

	@Input('input-mask-options') options: Object = {};
	@Input('input-mask') pattern: string;

	constructor(private el: ElementRef,
		private control: NgControl) { }

	ngAfterContentInit() {
		$(this.el.nativeElement).mask(this.pattern, this.options);
		setTimeout(() => {
			let value = $(this.el.nativeElement).data('mask').getMaskedVal(this.control.control.value);
			if (this.control.control.value != value) {
				this.control.control.setValue(value);
			}
		}, 0);
	}

	ngOnDestroy() {
		$(this.el.nativeElement).unmask();
	}

	ngOnChanges(changes: SimpleChanges) {
		Log.info('ngOnChanges called');

		this.control.valueChanges.subscribe(param => {
			Log.log('ngOnChanges param: ', param);
			this.change();
		});
	}

	change() {
		let value = $(this.el.nativeElement).data('mask').getMaskedVal($(this.el.nativeElement).val());
		if (this.control.control.value != value) {
			this.control.control.setValue(value);
		}
	}

}
