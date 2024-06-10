const modInfo = {
	name: "Adaptation Tree",
	id: "adaptation-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "power",
	modFiles: ["stimulation.js", "growth.js", "evolution.js", "acclimation.js", "species.js", "consciousness.js", "domination.js", "ecosystem.js", "revolution.js", "expansion.js", "war.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // in hours
}

const VERSION = {
	num: "2.3",
	name: "Declaration of War",
};

const winText = "Congratulations!<br>You have reached the end and beaten this game (for now),<br>but there is more content coming soon...";

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
let doNotCallTheseFunctionsEveryTick = [];

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
	if (hasChallenge("e", 21) && challengeEffect("e", 21)[3]) gain = gain.mul(challengeEffect("e", 21)[3]);
	// exponentiate power gain
	if (hasChallenge("e", 19)) gain = gain.pow(1.02);
	// special effects
	if (player.d.unlocked) gain = gain.mul(tmp.d.effect);
	// return
	return gain;
};

function getPoints() {
	return getPointPotential().mul(1 - 1 / ((10 / 9) ** player.adaptationTime));
};

function getStatBulk() {
	let bulk = 1;
	if (player.r.points.gte(9)) bulk *= 10;
	if (player.ex.points.gte(6)) bulk *= 10;
	if (player.ex.points.gte(9)) bulk *= 10;
	if (player.w.points.gte(6)) bulk *= 10;
	return bulk;
};

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	adaptationTime: 0, // note: has coded-in logic in game.js to make it work
}};

// Display extra things at the top of the page
let displayThings = [
	() => {
		if (tmp.other.oompsMag != 0 && options.showOOMs) return "(" + format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : (tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "")) + "s/sec)";
		return "(" + format(getPointPotential()) + " max power)";
	},
	() => "<br>current endgame is at 250,000 " + (player.cb.unlocked ? "conscious beings" : "???"),
];

// Determines when the game "ends"
function isEndgame() {
	return player.cb.points.gte(250000);
};

// Style for the background, can be a function
let backgroundStyle = {};

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1;
};

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
	for (const key in layers.ex.buyables) {
		if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20) {
			player.ex.extra[key - 11] = new Decimal(player.ex.extra[key - 11] || 0);
		};
	};
};
