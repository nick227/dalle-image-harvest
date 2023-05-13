const lists = require('./lists/index');
const { random, start } = require('./bin/lib');
Array.prototype.random = random;

const targetPath = '../images/';
const timer = 1000 * 60 * 0.41;
const limit = 1;

const mods = ['movie poster', 'record jacket', 'band art', 'show flier', 'masterpiece'];
const mods1 = ['premium-quality', 'high-detail', 'symmetical', 'graphics design', 'typography' ,'print-ready', 'sharp'];
const mods2 = ['product-photography', 'commercial-photography', 'dramatic-lighting', 'flash-photography'];

const prompt = [
		'abstract two-color black-white ',
		lists.mediums.random(),
		mods.random(),
		lists.angles.random(),
		['happy', 'enthusiastic', 'surprised'].random(),
		lists.dogs.concat(lists.animals.random()).random(),
		'wearing ' + lists.colors1.random() + ' ' + lists.clothes.random(),
		'white-background, no-crop,',
		lists.graphicDesigners.random()+' style',
			].join(' ');

start(prompt, targetPath, timer, limit);