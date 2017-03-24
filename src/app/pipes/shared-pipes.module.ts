import { NgModule } from '@angular/core';

import { BooleanPipe } from "./boolean.pipe";
import { MaskPipe } from "./mask.pipe";

@NgModule({
    declarations: [BooleanPipe, MaskPipe],
    exports: [BooleanPipe, MaskPipe]
})
export class SharedPipesModule { }
