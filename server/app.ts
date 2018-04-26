import 'reflect-metadata';
import 'core-js/es7/reflect';
import * as express from "express";
import * as expressLogging from 'express-logging';
import * as logger from 'logops';
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";
import { Container } from 'typedi';
import * as cors from 'cors';

import { loginRouter } from "./routes/loginRouter";
import { protectedRouter } from "./routes/protectedRouter";
import { userRouter } from "./routes/userRouter";
import { contaRouter } from "./routes/contaRouter";
import { lancamentoRouter } from "./routes/lancamentoRouter";
import { categoriaRouter } from "./routes/categoriaRouter";
import { DataAccess } from "./dal/abstractDAO";

const app: express.Application = express();

//Inicializa conexão
Container.get(DataAccess).openDbConnection();

//Log config - express-logging
app.use(expressLogging(logger));
logger.info("** LOGGER INICIALIZADO");

//Disable header: X-Powered-By:Express
app.disable("x-powered-by");
app.use(favicon(join(__dirname, "../../src", "favicon.ico")));
app.use(express.static(join(__dirname, '../../dist')));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use("/", loginRouter);
app.use("/api", protectedRouter);
app.use("/api/users", userRouter);
app.use("/api/contas", contaRouter);
app.use("/api/lancamentos", lancamentoRouter);
app.use("/api/categorias", categoriaRouter);

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {

    app.use(express.static(join(__dirname, '../../node_modules')));
    //app.use(express.static(join(__dirname, '../../tools')));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}

app.use('/*', function(request: express.Request, response: express.Response) {
    // response.redirect(join(__dirname, '../../public/index.html'));
    //response.sendFile("index.html", {root:join(__dirname, "../../src")});
    response.sendFile(join(__dirname, '../../dist', 'index.html'));
});

// PARAMETRO PASSADO ATRAVES DO NOMEMON, exemplo.
//logger.info(`## FROM NOMEMON, process.env.NODE_ENV = ${process.env.NODE_ENV}`);
// PARAMETRO PASSADO ATRAVES DE CONFIGURACAO NO package.json, exemplo.
//logger.info("npm_package_config_port: " + process.env.npm_package_config_port)

// Porta que o express irá escutar as requisições
//const port: number = process.env.PORT || 3005;
const port = process.env.npm_package_config_port || 3001;

// Iniciar o servidor na porta especificada
app.listen(port, () => {
    // Mensagem de inicialização com sucesso
    logger.info(`## Escutando no endereço: http://localhost:${port}/`);
});

// catch 404 and forward to error handler
// app.use(function(req: express.Request, res: express.Response, next) {
//     let err = new Error("Not Found");
//     next(err);
// });

// production error handler
// no stacktrace leaked to user
// app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
//     res.status(err.status || 500);
//     res.json({
//         error: {},
//         message: err.message
//     });
// });
