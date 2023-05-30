

const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var https = require('https'),
	Stream = require('stream').Transform,
	fs = require('fs');



module.exports.start = function(){
// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
	const prompt = req.query.prompt;
	try {
		generateImage(prompt, res)

	} catch (err) {
		console.log('error', err)
		res.send(err);
	}
});

const port = 8080;
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

	
}


