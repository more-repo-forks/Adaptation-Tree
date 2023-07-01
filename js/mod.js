const modInfo = {
	name: "Booster-Generator Tree",
	id: "booster-generator-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "points",
	modFiles: ["layers.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 24, // in hours
}

const VERSION = {
	num: "1.5",
	name: "Super-Power Time",
};

const winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
var doNotCallTheseFunctionsEveryTick = [];

function canGenPoints() {
	return true;
};

function getPointGen() {
	let gain = new Decimal(1);
	if (hasUpgrade("g", 11)) gain = gain.mul(upgradeEffect("g", 11));
	if (hasUpgrade("g", 12)) gain = gain.mul(upgradeEffect("g", 12));
	if (hasUpgrade("g", 13)) gain = gain.mul(upgradeEffect("g", 13));
	if (hasUpgrade("g", 15)) gain = gain.mul(upgradeEffect("g", 15));
	if (hasUpgrade("b", 22)) gain = gain.mul(upgradeEffect("b", 22));
	if (player.g.unlocked) gain = gain.mul(tmp.g.effect);
	if (player.b.unlocked) gain = gain.mul(tmp.b.effect);
	return gain;
};

const productionCap = 100; // in seconds

const endgameBoosters = new Decimal(348);

function maxPoints() {
	return hasMilestone("sb", 3);
};

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}};

// Display extra things at the top of the page
var displayThings = [
	() => {
		if (tmp.gameEnded) return "<br>you have beaten the game!";
		return "<br>you need " + formatWhole(endgameBoosters) + " boosters to beat the game";
	},
];

// Determines when the game "ends"
function isEndgame() {
	return player.b.points.gte(endgameBoosters);
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
