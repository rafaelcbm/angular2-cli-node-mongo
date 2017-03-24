import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (value && value !== "false") {
			return "Sim";
		} else if (value == 'false') {
			return "Não";
		} else {
			return "-";
		}
	}
}
