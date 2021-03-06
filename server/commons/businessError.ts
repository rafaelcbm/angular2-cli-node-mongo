import * as logger from 'logops';
import { Response } from "express";

export class BusinessError extends Error {
	constructor(message) {
		super(message);
		this.name = 'BusinessError';
	}
}

export function handleError(e: Error, response?: Response) {

	if (e instanceof BusinessError) {
		logger.warn("** Warn = ", e);
		if (response) {
			return response.json({
				"status": "erro",
				"message": e.message
			});
		}
	}
	logger.error("** Error = ", e);
	return response.status(500).send('Ocorreu um erro inesperado no servidor!');
}
