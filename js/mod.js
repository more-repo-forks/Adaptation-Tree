const modInfo = {
	name: "Adaptation Tree",
	id: "adaptation-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "power",
	modFiles: ["layers.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // in hours
}

const VERSION = {
	num: "1.0",
	name: "Stimulation",
};

const winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
var doNotCallTheseFunctionsEveryTick = [];

function canGenPoints() {
	return true;
};

function getPointPotential() {
	// start
	let gain = new Decimal(1);
	// increase base power gain
	if (hasUpgrade("s", 11)) gain = gain.add(upgradeEffect("s", 11));
	if (hasUpgrade("s", 12)) gain = gain.add(upgradeEffect("s", 12));
	if (hasUpgrade("s", 13)) gain = gain.add(upgradeEffect("s", 13));
	if (hasUpgrade("s", 14)) gain = gain.add(upgradeEffect("s", 14));
	if (hasUpgrade("s", 15)) gain = gain.add(upgradeEffect("s", 15));
	// multiply power gain
	if (player.s.unlocked) gain = gain.mul(tmp.s.effect);
	if (hasUpgrade("s", 31)) gain = gain.mul(upgradeEffect("s", 31));
	if (hasUpgrade("s", 32)) gain = gain.mul(upgradeEffect("s", 32));
	if (hasUpgrade("s", 33)) gain = gain.mul(upgradeEffect("s", 33));
	if (hasUpgrade("s", 34)) gain = gain.mul(upgradeEffect("s", 34));
	if (hasUpgrade("s", 35)) gain = gain.mul(upgradeEffect("s", 35));
	// end
	return gain;
};

function getPoints() {
	return getPointPotential().mul(1 - 1 / ((10 / 9) ** player.adaptationTime));
};

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	adaptationTime: 0, // note: has coded-in logic in game.js to make it work
}};

// Display extra things at the top of the page
var displayThings = [
	() => {return "(" + format(getPointPotential()) + " max power)"},
];

// Determines when the game "ends"
function isEndgame() {
	return false;
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
