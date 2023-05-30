const lists = require('./lists/index');
const { random, start } = require('./bin/lib');
Array.prototype.random = random;

const targetPath = './images/';
const timer = 1000 * 60 * 0.16;
const limit = 24;

const mods = ['movie poster', 'record jacket', 'band art', 'show flier', 'masterpiece'];
const mods1 = ['premium-quality', 'high-detail', 'symmetical', 'graphics design', 'typography' ,'print-ready', 'sharp'];
const mods2 = ['product-photography', 'commercial-photography', 'dramatic-lighting', 'flash-photography'];

const promptArray = [
		//lists.mediums.random() + ' ' + lists.clothes.random(),
		//lists.colors1.random() + ' background, no-crop',
		//lists.puns.random()+' and, ',
		lists.angles.random(),
			].join(' ');

function prompt(){
	return [
		lists.adjectives.random(),
		' fun ',
		lists.cats.concat(lists.dogs.shirts).random(),
		mods.random()
	].join(', ')
}

//prompt accepts string or function
start(prompt, targetPath, timer, limit);