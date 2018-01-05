const fs = require('fs');
const os = require('os');

const EOL = os.EOL;
const CSVsimple = module.exports;
const regSeparator = /,/;
const regA = /"/;
const regAg = /"/g;
const regAA = /""/;
const regAAg = /""/g;
const regEOL = new RegExp("\\r\\n");
const regEOLg = new RegExp("\\r\\n", 'g');

function stringify(value) {
	if(!value) {
		return value === 0 || value === false ? value : ""
	}
	if(typeof value === "string") {
		if(regEOL.test(value)) {
			return '"' + value.replace(regEOLg, '\n').replace(regAg, '""') + '"'
		} else if(regA.test(value)) {
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
		let isA = true,
			cacheString;
		const array = [];
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
						cacheString.push(v.substring(0, v.length - 1).replace(regAAg, '"'));
						array.push(cacheString.join(","))
					} else {
						cacheString.push(v.replace(regAAg, '"'))
					}
				} else {
					cacheString.push(v)
				}
			}
		});
		return array
	}
	return value.split(",")
}

CSVsimple.write = (path, array) => {
	return new Promise((resolve, reject) => {
		const keys = Object.keys(array[0] || {}),
			fWrite = fs.createWriteStream(path),
			CATCH_Lines = 1000,
			MAX_Index = array.length - 1;

		let cache = [],
			index = 0;

		fWrite.on('open', () => {
			fWrite.write('\ufeff');
			cache.push(keys.join(","));
			array.forEach((item, i) => {
				let row = [];
				keys.forEach(key => row.push(stringify(item[key])));
				index++;
				cache.push(row.join(","))
				if(index === CATCH_Lines || i === MAX_Index) {
					fWrite.write(cache.join(EOL));
					cache.length = index = 0
				}
			});
			fWrite.end()
		});

		fWrite.on('error', (err) => reject(err));

		fWrite.on('finish', () => resolve(true));
	})
}

CSVsimple.read = path => {
	return new Promise((resolve, reject) => {
		const fRead = fs.createReadStream(path);

		let fields = [],
			i = 0,
			_buffer = new Buffer(0),
			result = [];

		function read(buffer) {
			let index = -1,
				offset = 0;
			do {
				index = buffer.indexOf(EOL, offset);
				if(index > -1) {
					line(buffer.slice(offset, index).toString())
					offset = index + EOL.length
				}
			} while (index > -1)
			return offset ? buffer.slice(offset) : buffer
		}

		function line(value) {
			if(i++) {
				let row = {},
					array = parseArray(value);
				fields.forEach((field, i) => {
					row[field] = array[i]
				});
				result.push(row)
			} else {
				fields = value.split(",")
			}
		}

		fRead.on('data', (chunk) => {
			fRead.pause();
			_buffer = read(Buffer.concat([_buffer, chunk]));
			fRead.resume()
		});

		fRead.on('end', () => {
			_buffer.length && line(_buffer.toString());
			resolve(result)
		});

		fRead.on('error', (err) => reject(e));
	})
}