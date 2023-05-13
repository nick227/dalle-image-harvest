require('dotenv').config();
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const db = require('./db');
const {
  Configuration,
  OpenAIApi
} = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.start = async function(prompt, dir, timer, limit) {
  folderCheck(dir);
  const promises = [];
  for (let i = 0; i < limit; i++) {
    promises.push(
      new Promise(async (resolve, reject) => {
        await run(prompt, dir, timer * i, resolve, reject);
      })
    );
  }
  async function runPromises() {
    for (let i = 0; i < promises.length; i++) {
      await promises[i];
      await new Promise(resolve => setTimeout(resolve, timer));
    }
    console.log("All promises resolved");
    db.close();
  }
  await runPromises();
};

module.exports.shuffle = function(list) {
  return list
    .map(value => ({
      value,
      sort: Math.random()
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({
      value
    }) => value)
}

module.exports.random = function() {
  return this[Math.floor((Math.random() * this.length))] || '';
}

async function run(prompt, dir, timer, resolve, reject) {
  try{
  setTimeout(async function() {
    console.log('------');
    console.log(prompt);
    console.log(dir);
    //await generateImage(prompt, dir, resolve, reject);
    resolve();
  }, timer);

  }catch(err){
    console.log("err", err)
  }
}

async function generateImage(prompt, dir, resolve, reject) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data.data[0].url;
    console.log('gen ok');
    const filename = await saveImage(imageUrl, prompt, dir);
    await saveRequest(prompt, filename);
    resolve();
  } catch (error) {
    console.log('******');
    console.log('err!', error.message);
    reject();
  }
}

async function saveRequest(prompt, filename) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    db.run(`INSERT INTO requests(prompt, filename, timestamp) VALUES('${prompt}', '${filename}', '${timestamp}')`, function(err) {
      if (err) {
        console.log(err.message);
        resolve();
      } else {
        console.log(`sqlite ok`);
        resolve();
      }
    });
  });
}

async function saveImage(imageUrl, prompt, dir) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.request(imageUrl, function(response) {
        var data = new Stream();

        response.on('data', function(chunk) {
          data.push(chunk);
        });

        response.on('end', function() {
          const filename = makeFileNameSafeForWindows(prompt) + '-' + Date.now();
          fs.writeFileSync(dir + '/' + filename + '.jpg', data.read());
          console.log('save ok');
          resolve(filename);
        });
      }).end();

      req.on('error', function(res) {
        console.log('Err');
        reject();
      });
    } catch (error) {
      console.log('**********');
      console.log(error);
      console.log('error', prompt);
      reject();
    }
  });
}


function makeFileNameSafeForWindows(name) {
  const illegalChars = /[<>:"\/\\|?*]/g;
  const maxLength = 190;
  const safeName = name.replace(illegalChars, '');
  return safeName.slice(0, maxLength);
}

function folderCheck(targetFolderName) {
	const targetPath = targetFolderName;
	const parts = targetPath.split('/');
	let currentStr = '';
	parts.forEach((folder) => {
		currentStr = currentStr ? currentStr + '/' + folder  : folder;
	if (!fs.existsSync(currentStr)) {
	  fs.mkdirSync(currentStr);
	  console.log(`Folder ${targetPath} created.`);
	}else{
    console.log(`Folder ${targetPath} exists.`);
  }
	});
	return targetPath;
}