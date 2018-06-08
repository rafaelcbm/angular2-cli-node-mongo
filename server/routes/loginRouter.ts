import * as util from 'util';
import { parse } from 'date-fns';
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
const fetch = require('node-fetch');

var HttpsProxyAgent = require('https-proxy-agent');
var proxy = 'http://localhost:3128';
var agent = new HttpsProxyAgent(proxy);

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
		}));
})

loginRouter.get('/callback', function (req, res) {
	let userName;
	let code = req.query.code || null;
	let clientID = '8a209baf8e0c42eea897b32fe2e5d19a';
	let clientSecret = '9cd626a83a764fb3a9f5f60bdc8b93e5';

	let data = {
		code: code,
		redirect_uri,
		grant_type: 'authorization_code'
	}

	let postData = querystring.stringify(data);

	fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		agent: agent,
		headers: {
			'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length,
		},
		body: postData
	})
		.then(res => res.json())
		.then(json => {
			console.log(json);
			var access_token = json.access_token;
			console.log('** access_token = ', access_token);
			if (access_token) {
				return fetch('https://api.spotify.com/v1/me', {
					agent: agent,
					headers: {
						'Authorization': 'Bearer ' + access_token
					}
				});
			} else {
				return res.json({
					"status": "erro",
					"message": "Erro ao registrar usuário via Spotify!"
				});
			}
		})
		.then(apiRes => apiRes.json())
		.then(json => {
			console.log('** User Data From Spotify: ', json);
			userName = json.email;
			return userDAO.getUser(json.email);
		})
		.then((usuarioObtido) => {
			console.log('** usuarioObtido=', usuarioObtido);


			if (!usuarioObtido) {
				let user: any = {};
				user.userName = userName;
				//Criar Salt por usuário
				const salt = randomBytes(128).toString("base64");
				user.salt = salt;
				const password = randomBytes(12).toString("base64");
				user.password = password;

				pbkdf2(password, user.salt, 10000, length, digest, function (err, hash) {
					user.hash = hash.toString("hex");
					userDAO.insertUser(user).then((resultInsercao) => {
						console.log('** userName=', userName);
						userDAO.getUser(userName)
							.then((savedUser) => {
								console.log('** USUARIO CRIADO =', savedUser);

								const tokenJWT = sign({ "userName": savedUser.userName, permissions: [] }, secret, { expiresIn: "7d" });

								let uri = process.env.FRONTEND_URI || 'http://localhost:4200/register';
								res.redirect(uri + '?token=' + tokenJWT + '&newUser=true');
							})
					});
				});
			} else {
				const pbkdf2Promisified = util.promisify(pbkdf2);

				pbkdf2Promisified(usuarioObtido.password, usuarioObtido.salt, 10000, length, digest).then(function (hash) {
					logger.info("** NO pbkdf2 hash = %s ", hash);
					// check if password is active
					if (hash.toString("hex") === usuarioObtido.hash) {
						const tokenJWT = sign({ "userName": usuarioObtido.userName, permissions: [] }, secret, { expiresIn: "7d" });
						logger.info("** tokenJWT = %s ", tokenJWT);
						let uri = process.env.FRONTEND_URI || 'http://localhost:4200/register';
						res.redirect(uri + '?token=' + tokenJWT);
					} else {
						return res.json({
							"status": "erro",
							"message": "Password incorreto!"
						});
					}
				});
			}
		})
		.catch(e => {
			console.log('** ERRO ao autenticar via Spotify. Erro: ', e);
			return res.json({
				"status": "erro",
				"message": "Erro ao registrar usuário via Spotify!"
			});
		});
})



//bkp POST SUCESSO

// let options = {
// 	//protocol :'https:',
// 	//port: 80,
// 	hostname: 'accounts.spotify.com',
// 	path: '/api/token',
// 	agent: agent,
// 	method: 'POST',
// 	headers: {
// 		'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
// 		'Content-Type': 'application/x-www-form-urlencoded',
// 		'Content-Length': postData.length,
// 	},
// };
// let postRequest = https.request(options, (postResponse) => {
// 	console.log(`STATUS: ${postResponse.statusCode}`);
// 	//console.log(`HEADERS: ${JSON.stringify(postResponse.headers)}`);
// 	postResponse.setEncoding('utf8');
// 	postResponse.on('data', (postResponse) => {
// 		let respObj = JSON.parse(postResponse);
// 		var access_token = respObj.access_token;
// 		console.log('** access_token = ', access_token);
// 		if (access_token) {

// 			fetch('https://api.spotify.com/v1/me', {
// 				agent: agent,
// 				headers: {
// 					'Authorization': 'Bearer ' + access_token
// 				}
// 			})
// 				.then(apiRes => apiRes.json())
// 				.then(json => {
// 					console.log('** API RESPONDEU');
// 					console.log(json);
// 					let uri = process.env.FRONTEND_URI || 'http://localhost:4200';
// 					res.redirect(uri + '?user=' + json.email);
// 				})
// 				.catch(e => {
// 					console.log('** ERRO ao autenticar via Spotify. Erro: ', e);
// 					return res.json({
// 						"status": "erro",
// 						"message": "Erro ao registrar usuário via Spotify!"
// 					});
// 				});
// 		} else {
// 			return res.json({
// 				"status": "erro",
// 				"message": "Erro ao registrar usuário via Spotify!"
// 			});
// 		}
// 	});
// 	postResponse.on('end', () => {
// 		console.log('No more data in response.');
// 	});
// });

// postRequest.on('error', (e) => {
// 	console.log(`problem with request: ${e.message}`);
// 	return res.json({
// 		"status": "erro",
// 		"message": "Erro ao registrar usuário via Spotify!"
// 	});
// });

// postRequest.write(postData);
// postRequest.end();

/************************************************************************************************************************************** */

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
// 		agent: agent,
// 		headers: {
// 			'Authorization': 'Basic ' + (new Buffer(
// 				'8a209baf8e0c42eea897b32fe2e5d19a' + ':' + '9cd626a83a764fb3a9f5f60bdc8b93e5'
// 			).toString('base64')),
// 			'content-type': 'application/x-www-form-urlencoded'
// 		}
// 	}

// 	//logger.info('*** authOptions = %j', authOptions);

// 	request.post(authOptions, function (error, response, body) {
// 		logger.info('** error = %j', error);
// 		logger.info('** response = %j', response);
// 		logger.info('** body = %j', body);
// 		var access_token = body.access_token;
// 		logger.info('** access_token = %j', access_token);
// 		let uri = process.env.FRONTEND_URI || 'http://localhost:4200'
// 		res.redirect(uri + '?access_token=' + access_token)
// 	})
// })

