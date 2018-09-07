import { NgModule } from '@angular/core';

import { FocusDirective } from './focus.directive';
import { InputMaskDirective } from './input.mask.directive';
import { FocusBlurDirective } from './focus-blur.directive';


@NgModule({
    declarations: [FocusDirective, InputMaskDirective, FocusBlurDirective],
    exports: [FocusDirective, InputMaskDirective, FocusBlurDirective]
})
export class SharedDirectivesModule { }
