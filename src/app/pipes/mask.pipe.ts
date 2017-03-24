import { Pipe, PipeTransform } from '@angular/core';

declare let $: any;

@Pipe({
	name: 'mask'
})
export class MaskPipe implements PipeTransform {

	transform(value: any, pattern: string): string {

		let input = $("<input>");

		input.val(value);
		input.mask(pattern);

		return input.val();
	}
}
