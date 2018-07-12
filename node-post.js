const fetch = require('node-fetch');

const querystring = require('querystring');
const http = require('http');
const https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

var proxy = 'http://localhost:3128';
console.log('using proxy server %j', proxy);
var agent = new HttpsProxyAgent(proxy);

let data = {
	name: "paul rudd",
	job: "leader"
}

let postData = querystring.stringify(data);


let options = {
	protocol: 'https:',
	host: 'reqres.in',
	//port: 80,
	path: '/api/users',
	// host: '127.0.0.1',
	// port: 3128,
	// path:'https://accounts.spotify.com/api/token',
	method: 'POST',
	agent: agent,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
	}
};

// POST
let req2 = https.request(options, (res) => {
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
req2.write(postData);
req2.end();


//GET
// let req3 = https.request(options, (res) => {
// 	console.log(`STATUS: ${res.statusCode}`);
// 	console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
// 	res.setEncoding('utf8');
// 	res.on('data', (chunk) => {
// 		console.log(`BODY: ${chunk}`);
// 	});
// 	res.on('end', () => {
// 		console.log('No more data in response.');
// 	});
// });

// req3.on('error', (e) => {
// 	console.log(`problem with request: ${e.message}`);
// });

// req3.end();



/************************************************************************************* */
// var myHeaders = new Headers();
// myHeaders.append("Access-Control-Allow-Origin", "*");
// myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
// myHeaders.append("Content-Length", content.length.toString());

// var myInit = {
// 	method: 'GET',
// 	headers: myHeaders,
// 	mode: 'cors',
// 	cache: 'default'
// };

// fetch('https://reqres.in/api/users/2', {
// 	mode: 'cors',
// 	headers: {
// 		'Content-Type': 'application/x-www-form-urlencoded'
// 	}
// }).then(function (response) {
// 	console.log(`response: ${response}`);
// 	return response.json();
// })
// 	.then(function (data) {
// 		console.log(`data: ${data}`);
// 	})
// 	.catch(e => console.log(`error recebido: ${e}`));

	/************************************************************************************* */

// fetch('https://reqres.in/api/users', {
// 	headers: {
// 		'Content-Type': 'application/x-www-form-urlencoded'
// 	},
// 	method: 'post',
// 	body: JSON.stringify(data)
// })
// 	.then(function (response) {
// 		console.log(`response: ${response}`);
// 		return response.json();
// 	})
// 	.then(function (data) {
// 		console.log(`data: ${data}`);
// 	})
// 	.catch(e => console.log(`error recebido: ${e}`));
