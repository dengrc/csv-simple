# csv-simple
* write(path,array)
* read(path)

```javascript
const csv = require('csv-simple');
csv.write("./file.csv", [{
        a: 1,
		b: true,
		c: '看到发"卡的看法地方'
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
```

```javascript
const csv = require('csv-simple');
csv.read("./file.csv").then((result) => {
	console.log(result);
}).catch(e => {
	console.log("error", e);
})
```