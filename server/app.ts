import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";

import { loginRouter } from "./routes/login";
import { protectedRouter } from "./routes/protected";

//import mongodb = require('mongodb');

// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');

// // Connection URL
// var url = 'mongodb://localhost:27017/test';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("** Connected successfully to server **");

//   console.log("** db = **", db);

//   //db.close();
// });

const app: express.Application = express();

app.disable("x-powered-by");

app.use(favicon(join(__dirname, "../../src", "favicon.ico")));
app.use(express.static(join(__dirname, '../../dist')));

app.use(json());
app.use(urlencoded({ extended: true }));


/*mongodb.MongoClient.connect('mongodb://127.0.0.1/test', (err, db) => {
                
                console.log("Connected correctly to MongoDB server.");
                console.log(db);
                this.dbConnection = db;
            });*/

/*var server = new mongodb.Server('localhost', 27017);
var db = new mongodb.Db('test', server, { w: 1 });
db.open(function() {console.log("** Conexao estabelecida no MongoDB! **")});*/

// api routes
app.use("/api", protectedRouter);
app.use("/login", loginRouter);

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

app.use('/*', function (request: express.Request, response: express.Response){
    // response.redirect(join(__dirname, '../../public/index.html'));
    //response.sendFile("index.html", {root:join(__dirname, "../../src")});
    response.sendFile(join(__dirname, '../../dist','index.html'));
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

export { app }
