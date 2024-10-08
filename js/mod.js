const modInfo = {
	name: "Adaptation Tree",
	id: "adaptation-tree-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "power",
	modFiles: ["technical/stats.js", "stimulation.js", "growth.js", "evolution.js", "acclimation.js", "species.js", "consciousness.js", "domination.js", "ecosystem.js", "revolution.js", "expansion.js", "war.js", "leader.js", "continent.js", "territory.js", "cycle.js", "empire.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1, // in hours
}

const VERSION = {
	num: "3.3.0",
	name: "The Economy",
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
	if (inChallenge("e", 14)) return decimalOne;
	// start
	let gain = new Decimal(1);
	// increase base power gain
	if (hasUpgrade("s", 11)) gain = gain.add(upgradeEffect("s", 11));
	if (hasUpgrade("s", 12)) gain = gain.add(upgradeEffect("s", 12));
	if (hasUpgrade("s", 13)) gain = gain.add(upgradeEffect("s", 13));
	if (hasUpgrade("s", 14)) gain = gain.add(upgradeEffect("s", 14));
	if (hasUpgrade("s", 15)) gain = gain.add(upgradeEffect("s", 15));
	// multiply power gain
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
	gain = gain.mul(tmp.s.effect);
	if (tmp.l.effect[0]) gain = gain.mul(tmp.l.effect[0]);
	// exponentiate power gain
	if (hasChallenge("e", 19)) gain = gain.pow(1.02);
	// special effects
	if (player.d.unlocked) gain = gain.mul(tmp.d.effect);
	if (inChallenge("co", 11)) gain = gain.log10().add(1);
	// return
	return gain;
};

function getPoints() {
	return getPointPotential().mul(1 - 1 / ((10 / 9) ** player.adaptationTime));
};

function getStatBulk() {
	let bulk = 1;
	if (hasMilestone("d", 52)) bulk *= 10;
	if (hasMilestone("d", 55)) bulk *= 10;
	if (hasMilestone("r", 96)) bulk *= 10;
	if (hasMilestone("r", 101)) bulk *= 10;
	if (player.r.points.gte(9)) bulk *= 10;
	if (player.ex.points.gte(6)) bulk *= 10;
	if (player.ex.points.gte(9)) bulk *= 10;
	if (player.w.points.gte(6)) bulk *= 10;
	if (player.l.points.gte(4)) bulk *= 10;
	if (player.t.unlocked) bulk *= 10;
	if (player.cy.unlocks[0] >= 7) bulk *= 10;
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
	() => "<br>current endgame is at 1e21,000,000 " + (player.ex.unlocked ? "influence" : "???"),
];

// Determines when the game "ends"
function isEndgame() {
	return player.ex.influence.gte("1e21000000");
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
	for (const key in layers.ex.buyables)
		if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20)
			player.ex.extra[key - 11] = new Decimal(player.ex.extra[key - 11] || 0);
	for (let row = 1; row <= layers.t.grid.maxRows; row++)
		for (let col = 1; col <= layers.t.grid.cols; col++)
			player.t.extra[row * 100 + col] = new Decimal(player.t.extra[row * 100 + col] || 0);
	for (let index = 0; index < cycleUnlocks.length; index++)
		if (!player.cy.unlocks[index]) player.cy.unlocks[index] = 0;
	for (let index = 0; index < player.cy.generators.length; index++)
		player.cy.generators[index] = new Decimal(player.cy.generators[index] || 0);
};
