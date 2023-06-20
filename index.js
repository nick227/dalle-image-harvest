const lists = require('./lists/index');
const { random, start } = require('./bin/lib');
Array.prototype.random = random;

const targetPath = `../images/icons`;

const timer = 1000 * 60 * 0.35;
const limit = 2;

const mods = ['movie poster', 'record jacket', 'band art', 'show flier', 'masterpiece'];
const mods1 = ['premium-quality', 'high-detail', 'symmetical', 'graphics design', 'typography' ,'print-ready', 'sharp'];
const mods2 = ['product-photography', 'commercial-photography', 'dramatic-lighting', 'flash-photography'];
const mods3 = ['full-bleed, no-crop, centered'];

const promptString = 'minimal, icon, mouse-pointer, ui/ux';

function promptFunction() {
	return [lists.icons.random(),
			'icon',
			'solid',
			lists.colors.random() + ' background', 
			lists.graphicDesigners.concat(lists.artists).random() + ' style ',
			mods3,
			].join(', ');
}

const promptArray = lists.icons.map((icon, i) => {
	return [lists.allAdjectives.random(), 
			lists.office.random(),
			'icon',
			'solid background',
			lists.artists.random() + ' style '
			].join(', ');
});

start(promptFunction, targetPath, timer, limit);
