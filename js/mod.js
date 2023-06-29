const modInfo = {
	name: "Booster-Generator Tree",
	id: "booster-generator-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "points",
	modFiles: ["layers.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // In hours
}

const VERSION = {
	num: "1.0",
	name: "Generators",
};

const winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function canGenPoints() {
	return true;
};

function getPointGen() {
	let gain = new Decimal(1);
	if (player.g.unlocked) gain = gain.mul(tmp.g.effect);
	return gain;
};

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}};

// Display extra things at the top of the page
var displayThings = [
];

// Determines when the game "ends"
function isEndgame() {
	return false;
	// return player.points.gte(new Decimal("e1000000"));
};

// Style for the background, can be a function
var backgroundStyle = {
};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1;
};

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
};
