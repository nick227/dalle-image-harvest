const lists = require('./lists/index');
const { random, start } = require('./bin/lib');
Array.prototype.random = random;

const targetPath = './images/';
const timer = 1000 * 60 * 0.5;
const limit = 10;

const mods = ['movie poster', 'record jacket', 'band art', 'show flier', 'masterpiece'];
const mods1 = ['premium-quality', 'high-detail', 'symmetical', 'graphics design', 'typography' ,'print-ready', 'sharp'];
const mods2 = ['product-photography', 'commercial-photography', 'dramatic-lighting', 'flash-photography'];

const promptString = [
		lists.colors.random(),
		lists.puns.random(),
		lists.patterns.random(),
		lists.angles.random(),
		'background, no-crop',
			].join(' ');

function prompt(){
	return [
		lists.adjectives.random(),
		lists.cats.concat(lists.dogs.shirts).random(),
		mods.random()
	].join(', ')
}

//prompt is string or function
start(prompt, targetPath, timer, limit);