import { Router, Request, Response, NextFunction } from "express";
import { randomBytes, pbkdf2 } from "crypto";
import * as assert from "assert";
import { sign } from "jsonwebtoken";
import * as logger from 'logops';
//import * as request from 'request';
import * as querystring from 'querystring';

import { secret, length, digest } from '../config/constants';
import { UserDAO } from "../dal/userDAO";

var request = require('request');
const http = require('http');
const https = require('https');


export const loginRouter: Router = Router();

const userDAO: UserDAO = new UserDAO();

loginRouter.post("/signup", function (req: Request, response: Response, next: NextFunction) {

	let password = req.body.password;

	if (!password || !password.trim()) {
		let err = new Error("Password obrigatório!");
		return next(err);
	}

	let user: any = {
		userName: req.body.userName
	}

	userDAO.getUser(user.userName).then((document) => {

		if (document) {
			return response.json({
				status: "erro",
				message: "Usuário já existente!"
			});
		}

		//Criar Salt por usuário
		const salt = randomBytes(128).toString("base64");
		user.salt = salt;

		pbkdf2(password, user.salt, 10000, length, digest, function (err, hash) {

			user.hash = hash.toString("hex");

			userDAO.insertUser(user).then((result) => {
				userDAO.getUser(user.userName).then((savedUser) => {

					const token = sign({ "userName": savedUser.userName, permissions: [] }, secret, { expiresIn: "7d" });

					response.status(201).json({
						"status": "sucesso",
						"jwt": token
					});
				})
			});
		});
	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao registrar usuário!"
		});
	});

});


loginRouter.post("/login", function (req: Request, response: Response, next: NextFunction) {

	logger.info("** Login - Resquest body %j", req.body);

	userDAO.getUser(req.body.userName).then((user) => {

		pbkdf2(req.body.password, user.salt, 10000, length, digest, function (err, hash) {

			logger.info("** NO pbkdf2 %s , %s", err, hash);

			if (err) {
				logger.info(err);
			}

			// check if password is active
			if (hash.toString("hex") === user.hash) {

				const token = sign({ "userName": user.userName, permissions: [] }, secret, { expiresIn: "7d" });

				return response.json({
					"status": "sucesso",
					"jwt": token
				});
			} else {
				return response.json({
					"status": "erro",
					"message": "Password incorreto!"
				});
			}
		});

	}).catch((e) => {
		logger.info("** Error = ", e);

		return response.json({
			"status": "erro",
			"message": "Erro ao autenticar usuário!"
		});
	});
});

let redirect_uri =
	process.env.REDIRECT_URI ||
	'http://localhost:3001/callback'

loginRouter.get('/login-spotify', function (req, res) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: '8a209baf8e0c42eea897b32fe2e5d19a',
			scope: 'user-read-private user-read-email',
			redirect_uri
		}))
	//res.redirect('http://www.globo.com');
})

// loginRouter.get('/callback', function (req, res) {
// 	let code = req.query.code || null;
// 	logger.info('** code = %j', code);
// 	let authOptions = {
// 		url: 'https://accounts.spotify.com/api/token',
// 		form: {
// 			code: code,
// 			redirect_uri,
// 			grant_type: 'authorization_code'
// 		},
// 		headers: {
// 'Authorization': 'Basic ' + (new Buffer(
// 	'8a209baf8e0c42eea897b32fe2e5d19a' + ':' + '546195c706cd45469baedf1b99a53640'
// ).toString('base64')),
	// 			'content-type': 'application/x-www-form-urlencoded',
	// 			'Cache-Control': 'no-cache'
	// 		}
	// 		//,		json: true
	// 	}

	// 	logger.info('*** authOptions = %j', authOptions);
	// 	logger.info('*** request = %j', request);
	// 	logger.info('*** typeof request = %j', typeof request);
	// 	logger.info('*** typeof request.post = %j', typeof request.post);


	// 	request.post(authOptions, function (error, response, body) {
	// 		logger.info('** error = %j', error);
	// 		logger.info('** response = %j', response);
	// 		logger.info('** body = %j', body);
	// 		var access_token = body.access_token;
	// 		let uri = process.env.FRONTEND_URI || 'http://localhost:4200'
	// 		res.redirect(uri + '?access_token=' + access_token)
	// 	})
	// })


	loginRouter.get('/callback', function (req, res) {
		let code = req.query.code || null;

		logger.info('** code = %j', code);

		let data = {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code'
		}

		let postData = querystring.stringify(data);

		let options = {
			//protocol :'https:',
			// hostname: 'accounts.spotify.com',
			// port: 80,
			// path: '/api/token',

			host: '127.0.0.1',
			port: 3128,
			path:'https://accounts.spotify.com/api/token',
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + (new Buffer('8a209baf8e0c42eea897b32fe2e5d19a' + ':' + '546195c706cd45469baedf1b99a53640').toString('base64')),
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length,
			},
		};


		let req2 = http.request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				console.log(`BODY: ${chunk}`);
			});
			res.on('end', () => {
				console.log('No more data in response.');
			});
		});

		req2.on('error', (e) => {
			console.log(`problem with request: ${e.message}`);
		});
	})
