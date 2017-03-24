import { NgModule } from '@angular/core';

import { FocusDirective } from "./focus.directive";
import { InputMaskDirective } from "./input.mask.directive";


@NgModule({
    declarations: [FocusDirective, InputMaskDirective],
    exports: [FocusDirective, InputMaskDirective]
})
export class SharedDirectivesModule { }
