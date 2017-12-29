const csv = require('../index.js');
csv.write("./file.csv",Array.from(new Array(1000),function(a,i){
	return i%2?{
        a: 1,
		b: true,
		c: '看到发"卡的看\n法地方'
	}:{
		a: 2,
		b: false,
		c: "ddddpoo破,i哦ii！@#￥……&****（（"
	}
})).then(() => {
	console.log("success");
}).catch(e => {
	console.log("error", e);
})