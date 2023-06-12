require('dotenv').config();
const fs = require('fs');
const db = require('./db');
const async = require("async");
const https = require('https');
const colors = require('colors');
const Stream = require('stream').Transform;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
let folderChecked = false;

/**
 * start() initiates loop
 * @param {any}    promptObj - string, array or function of prompts
 * @param {string} dir       - target directory to save image
 * @param {number} timer     - time to pause between promises
 * @param {number} limit     - maximum iterations
 * @param {number} index     - starting pointer for arrays (optional)
 */

module.exports.start = async function(promptObj, dir, timer, limit, index=null) {
  showWelcome();
  folderCheck(dir);
  let apiError = false; 
  const tasks = getTasks(promptObj, dir, timer, limit, index, apiError);
  try {
    await runTasks(tasks, timer);
    showFinished();
  } catch (error) {
    console.log(colors.red(error));
    apiError = true;
  } finally {
    console.log("Closing db");
    db.close();
  }
};

/*
* Promises
*/

function getTasks(promptObj, dir, timer, limit, index, apiError){
  const tasks = [];
  for (let i = typeof index === 'number' ? index : 0; i < limit; i++) {
    tasks.push(
      function() {
        return new Promise(async (resolve, reject) => {
          const prompt = typeof promptObj === 'string' ? promptObj : typeof promptObj ==='function' ? promptObj() : promptObj[i];
          if (!apiError) {
            try {
              await run(prompt, dir, i, timer, limit);
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error("An error occurred in a previous promise!"));
          }
        });
      }
    );
  }
  return tasks;
}


async function runTasks(tasks, timer) {
  let resolvedTasks = 0;
  for (const task of tasks) {
    try {
      await task();
      resolvedTasks++;
      console.log(colors.green(`resolved`));
      console.log("--------");
    } catch (error) {
      console.log("Error in runTasks:", colors.red(error));
      throw error;
    }
  }
}

async function run(prompt, dir, counter, timer, limit) {
  try {
    await generateImage(prompt, dir);
    if(counter < limit-1){
      await pause(timer);
    }
  } catch (err) {
    console.log("run err", colors.red(err));
    throw err;
  }
}

/*
* Transactions
*/

async function getOpenAiImgEvent(prompt) {
  let interval = getRequestingLog('requesting');
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    clearRequestingLog(interval);
    console.log(colors.green('request ok'));
    if (response && response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0].url;
    } else {
    console.log(colors.red('invalid response'));
    }
  } catch (err) {
    clearRequestingLog(interval);
    console.log(colors.red('request error'));
    throw err;
  }
}

async function saveImageEvent(imageUrl, prompt, dir){
        interval = getRequestingLog('save image');
        const fileName = await saveImage(imageUrl, prompt, dir);
        clearRequestingLog(interval);
        console.log(colors.green('image ok'));
        return fileName;
}

async function saveRequestEvent(prompt, fileName){
        interval = getRequestingLog('save prompt');
        await saveRequest(prompt, fileName);
        clearRequestingLog(interval);
        console.log(colors.green('prompt ok'));
        return;
}

async function generateImage(prompt, dir) {
  return new Promise(async (resolve, reject) => {
    try {
        showPrompt(prompt, dir);
        const imageUrl = await getOpenAiImgEvent(prompt);
        const fileName = await saveImageEvent(imageUrl, prompt, dir);
        saveRequestEvent(prompt, fileName)
        resolve();
    } catch (error) {
        process.stdout.clearLine(); 
        process.stdout.cursorTo(0);
      if (error.response?.data?.error?.message) {
        console.log('err 1:', colors.red(error.response.data.error.message));
      } else if (error) {
        console.log('err 2:', colors.red(error));
      }
      reject();
    }
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
          resolve(filename);
        });
      }).end();

      req.on('error', function(err) {
        console.log('Save Image Error', colors.red(err));
        reject();
      });
    } catch (error) {
      console.log('Save Image Error', colors.red(error));
      console.log(error);
      console.log('error', prompt);
      reject();
    }
  });
}

async function saveRequest(prompt, filename) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().toISOString();
    const statement = db.prepare('INSERT INTO requests(prompt, filename, timestamp) VALUES (?, ?, ?)');
    statement.run(prompt, filename, timestamp, function(err) {
      if (err) {
        console.log("Save Request Error", colors.red(err.message));
        reject();
      }else{
        resolve();
      }
    });
    statement.finalize(); 
  });
}

/*
* Helpers
*/

function pause(duration) {
  showCounter(duration);
  return new Promise(resolve => setTimeout(resolve, duration));
}

function showCounter(duration) {
  let seconds = Math.floor(duration / 1000) - 5;
  const interval = setInterval(() => {
    if (seconds > 0) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0); 
      process.stdout.write(colors.yellow(`pause: ${seconds}`)); 
      seconds--;
    } else {
      process.stdout.clearLine(); 
      process.stdout.cursorTo(0); 
      clearInterval(interval);
    }
  }, 1000);
}

let promptCount = 1;
function showPrompt(prompt, dir){
  console.log(colors.brightCyan(`prompt ${promptCount}:`));
  console.log(prompt);
  console.log(colors.brightCyan('directory: ' + dir));
  promptCount++;
}

function showWelcome(prompt, dir){
  console.clear();
  console.log("*******************");
  console.log("DALLE·2 Harvest 1.0");
  console.log("*******************");
}

function showFinished(){
    console.log("");
    console.log("-----------------------");
    console.log("All promises resolved");
    console.log("-----------------------");
    console.log("");
}

function getRequestingLog(text){
  let count = 0;
  return setInterval(() => {
    process.stdout.clearLine(); 
    process.stdout.cursorTo(0); 
    let char = count % 2 ? "/" : "\\";
    process.stdout.write(colors.yellow(text+" "+char)); 
    count++;
  }, 500);
}

function clearRequestingLog(interval){
  process.stdout.clearLine(); 
  process.stdout.cursorTo(0);
  clearInterval(interval);
}

const folderCheck = (targetPath) => (
  fs.existsSync(targetPath)
    ? (console.log(`${targetPath} exists.`), targetPath)
    : (
        targetPath.split('/').reduce((currentPath, folder) => {
          currentPath += folder;
          fs.existsSync(currentPath)
            ? console.log(`${currentPath} exists.`)
            : (fs.mkdirSync(currentPath), console.log(`${currentPath} created.`));
          return `${currentPath}/`;
        }, ''),
        targetPath
      )
);

function makeFileNameSafeForWindows(name) {
  const illegalChars = /[<>:"\/\\|?*]/g;
  const maxLength = 100;
  const safeName = name.replace(illegalChars, '');
  return safeName.slice(0, maxLength);
}

/*
* Misc
*/

module.exports.shuffle = function(list) {
  return list
    .map(value => ({
      value,
      sort: Math.random()
    }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

module.exports.random = function() {
  return this[Math.floor((Math.random() * this.length))] || '';
}
