import { Model } from './generic-model.model';

export class Categoria extends Model {

	constructor(public nome?: string, public ancestrais?: number, public pai?: string, public _id?: string) {
		super(_id);
	}
}
