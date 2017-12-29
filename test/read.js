const csv = require('../index.js');
const os = require('os');
csv.read("./file.csv").then((result) => {
	console.log(result);
}).catch(e => {
	console.log("error", e);
});