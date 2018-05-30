import * as http from 'http';
import * as logger from 'logops';

import { app } from './express';
import { MongoDB } from './config/mongo-db';


startServer();

async function startServer() {
	logger.info('Iniciando server ............');

	await connectDB();

	// PARAMETRO PASSADO ATRAVES DO NOMEMON, exemplo.
	//logger.info(`## FROM NOMEMON, process.env.NODE_ENV = ${process.env.NODE_ENV}`);
	// PARAMETRO PASSADO ATRAVES DE CONFIGURACAO NO package.json, exemplo.
	//logger.info("npm_package_config_port: " + process.env.npm_package_config_port)

	// Porta que o express irá escutar as requisições
	const port = process.env.PORT || 3001;
	//const port = process.env.npm_package_config_port || 3001;

	http.createServer(app).listen(port, function () {
		logger.info('Servidor escutando na porta: ' + this.address().port);
	});
}

async function connectDB() {
	await MongoDB.connect();
}
