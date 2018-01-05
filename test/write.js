const csv = require('../index.js');
const os = require('os');
csv.write("./file.csv", Array.from(new Array(30), function(a, i) {
	return i % 2 ? {
		a: 1,
		b: true,
		c: '看到发卡的看\n法地方' + os.EOL + "aaa"
	} : {
		a: 2,
		b: false,
		c: "aaa" + os.EOL + "ddddpoo破,i哦ii！@#￥……&****（（"
	}
})).then(() => {
	console.log("success");
}).catch(e => {
	console.log("error", e);
})