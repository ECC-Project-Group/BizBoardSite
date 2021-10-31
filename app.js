const express = require("express");

const app = express();

app.get("/", (_, res) => {
	res.send("hello world");
});

app.listen(3030, () => {
	console.log(`up and running on 3030`);
});