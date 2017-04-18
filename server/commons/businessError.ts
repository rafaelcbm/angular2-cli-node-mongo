import * as logger from 'logops';
import { Response } from "express";

export class BusinessError extends Error {
	constructor(message) {
		super(message);
		this.name = 'BusinessError';
	}
}

export function handleError(e: Error, response?: Response) {

	logger.error("** Error = ", e);
	if (e instanceof BusinessError) {
		if (response) {
			return response.json({
				"status": "erro",
				"message": e.message
			});
		}
	}

	return response.status(500).send('Ocorreu um erro inesperado no servidor!');
}
