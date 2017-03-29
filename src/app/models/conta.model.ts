import { Model } from './generic-model.model';
export class Conta extends Model{
	
	constructor(public _id?: string, public nome?: string) { super(_id); }
}
