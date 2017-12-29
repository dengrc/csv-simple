//const fs = require('fs');
const readline = require('readline');
const fs = require('fs');
const os = require('os');

const CSVsimple = module.exports;
const regSeparator = /,/;
const regA = /"/;
const regAg = /"/g;
const regAA = /""/;
const regAAg = /""/g;

function stringify(value) {
	if(!value) {
		return value === 0 || value === false ? value : ""
	}
	if(typeof value === "string") {
		if(regA.test(value)) {
			return '"' + value.replace(regAg, '""') + '"'
		} else if(regSeparator.test(value)) {
			return '"' + value + '"'
		}
		return value
	}
	return value
}

function parseArray(value) {
	if(regA.test(value)) {
		var isA = true,
			cacheString,
			array = [];
		value.split(",").forEach(function(v, i) {
			if(isA) {
				if(regA.test(v)) {
					if(v.match(regAg).length % 2) {
						isA = false;
						cacheString = [v.replace(regAAg, '"').substr(1)];
					} else {
						array.push(v.substring(1, v.length - 1).replace(regAAg, '"'))
					}
				} else {
					array.push(v)
				}
			} else {
				if(regA.test(v)) {
					if(v.match(regAg).length % 2) {
						isA = true;
						cacheString.push(v.substring(0, v.length - 1).replace(regAAg, '"'))
						array.push(cacheString);
					} else {
						cacheString.push(v.replace(regAAg, '"'))
					}
				} else {
					cacheString.push(v)
				}
			}
		});
		return array;
	}
	return value.split(",")
}

CSVsimple.write = (path, array) => {
	return new Promise((resolve, reject) => {
		var keys = Object.keys(array[0] || {});
		var fWrite = fs.createWriteStream(path);
		fWrite.on('open', () => {
			fWrite.write('\ufeff');
			fWrite.write(keys.join(",") + os.EOL);
			array.forEach(item => {
				var row = [];
				keys.forEach(key => {
					row.push(stringify(item[key]))
				})
				fWrite.write(row.join(",") + os.EOL)
			});
			fWrite.end();
		});
		fWrite.on('error', (err) => {
			reject(err);
		});
		fWrite.on('finish', () => {
			resolve(true);
		});
	})
}

CSVsimple.read = path => {
	return new Promise((resolve, reject) => {
		var read = readline.createInterface({
			input: fs.createReadStream(path)
		});

		var fields = [],
			i = 0,
			result=[];
		read.on('line', (line) => {
			if(i++) {
				let row = {},
					array = parseArray(line);
				fields.forEach(function(field, i) {
					row[field] = array[i]
				});
				result.push(row)
			} else {
				fields = line.split(",")
			}
		});

		read.on('close', () => {
			resolve(result);
		});
	})
}

/*
CSVsimple.write("./file.csv", [{
		a: 1,
		b: true,
		c: '看到发"卡的看法地方'
	},
	{
		a: 2,
		b: false,
		c: "ddddpoo破i哦ii！@#￥……&****（（"
	},
	{
		a: 2,
		b: false,
		c: "ddddpoo破,i哦ii！@#￥……&****（（"
	}
]).then(() => {
	console.log("success");
}).catch(e => {
	console.log("error", e);
})


CSVsimple.read("./file.csv").then((e) => {
	console.log(e);
}).catch(e => {
	console.log("error", e);
})*/