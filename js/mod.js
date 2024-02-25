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
	num: "1.4",
	name: "Speciation",
};

const winText = "Congratulations!<br>You have reached the end and beaten this game (for now),<br>but there is more content coming soon...";

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
var doNotCallTheseFunctionsEveryTick = [];

function canGenPoints() {
	return false;
};

function getPointPotential() {
	// retrogression overrides
	if (inChallenge("e", 15)) return new Decimal(1e10).pow(player.g.milestones.length - 16).max(1);
	if (inChallenge("e", 14)) return new Decimal(1);
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
	if (hasUpgrade("s", 42)) gain = gain.mul(upgradeEffect("s", 42));
	if (hasUpgrade("s", 44)) gain = gain.mul(upgradeEffect("s", 44));
	if (hasUpgrade("s", 45)) gain = gain.mul(upgradeEffect("s", 45));
	if (hasUpgrade("s", 65)) gain = gain.mul(upgradeEffect("s", 65));
	if (hasUpgrade("s", 81)) gain = gain.mul(upgradeEffect("s", 81));
	if (player.g.unlocked) gain = gain.mul(buyableEffect("g", 11));
	// exponentiate power gain
	if (hasChallenge("e", 19)) gain = gain.pow(1.02);
	// return
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
	() => {
		if (tmp.other.oompsMag != 0 && options.showOOMs) return "(" + format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s/sec)";
		return "(" + format(getPointPotential()) + " max power)";
	},
	() => {return "<br>current endgame is 185 " + (player.e.unlocked ? "evolutions" : "???")},
];

// Determines when the game "ends"
function isEndgame() {
	return player.e.points.gte(185);
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
