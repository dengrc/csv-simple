const csv = require('../index.js');
const os = require('os');
var bu=new Buffer(0);
debugger;
csv.read("./file.csv").then((result) => {
	console.log(result);
}).catch(e => {
	console.log("error", e);
});
console.log(os.EOL)