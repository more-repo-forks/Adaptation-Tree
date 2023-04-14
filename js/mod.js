const modInfo = {
	name: "Realm Creator",
	id: "realm-creator-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["layers.js", "technical/tree.js"],
	initialStartPoints: new Decimal(0),
	offlineLimit: 1,  // In hours
}

const VERSION = {
	num: "0.4",
	name: "Super Beta",
};

const winText = `Congratulations! You have reached the end and beaten this game, but for now...`;

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function randint(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function callcast() {
	player['2'].callTime = new Decimal(30);
	player['2'].mana = player['2'].mana.sub(player['2'].callCost);
	player["2"].G.callCasts = player["2"].G.callCasts.add(1);
	player["2"].R.callCasts = player["2"].R.callCasts.add(1);
	player["2"].T.callCasts = player["2"].T.callCasts.add(1);
	setClickableState('2', 12, "ON");
}

function sidespellcast() {
	player['2'].sideSpellTime = new Decimal(15);
	player['2'].mana = player['2'].mana.sub(player['2'].sideSpellCost);
		if (hasUpgrade('1', 11)) {
			player["2"].G.holyCasts = player["2"].G.holyCasts.add(1);
			player["2"].R.holyCasts = player["2"].R.holyCasts.add(1);
			player["2"].T.holyCasts = player["2"].T.holyCasts.add(1);
		};
		if (hasUpgrade('1', 21)) {
			player["2"].G.frenzyCasts = player["2"].G.frenzyCasts.add(1);
			player["2"].R.frenzyCasts = player["2"].R.frenzyCasts.add(1);
			player["2"].T.frenzyCasts = player["2"].T.frenzyCasts.add(1);
		};
	setClickableState('2', 13, "ON");
};

function canGenPoints() {
	return true;
};

function getPointGen() {
	let gain = new Decimal(0);
	// addtitive
	if (getBuyableAmount('1', 12).gt(0)) gain = gain.add(getBuyableAmount('1', 12) * buyableEffect('1', 12));
	if (getBuyableAmount('1', 13).gt(0) && !hasUpgrade('1', 1143)) gain = gain.add(getBuyableAmount('1', 13) * buyableEffect('1', 13));
	// multiplicative
	if (hasUpgrade('1', 1062)) gain = gain.mul(upgradeEffect('1', 1062));
	if (hasUpgrade('1', 1161)) gain = gain.mul(upgradeEffect('1', 1161));
	if (hasUpgrade('1', 1163)) gain = gain.mul(upgradeEffect('1', 1163));
	if (hasUpgrade('1', 1071)) gain = gain.mul(upgradeEffect('1', 1071));
	if (hasUpgrade('1', 1072)) gain = gain.mul(upgradeEffect('1', 1072));
	if (hasUpgrade('1', 1073)) gain = gain.mul(upgradeEffect('1', 1073));
	gain = gain.mul(tmp['1'].effect);
	if (getClickableState('2', 12) == "ON") gain = gain.mul(clickableEffect('2', 12));
	if (hasUpgrade('1', 21) && getClickableState('2', 13) == "ON") gain = gain.mul(clickableEffect('2', 13));
	return gain;
};

const playerStartingStats = {
	best: new Decimal(0),
	total: new Decimal(0),
	FCchancebest: new Decimal(2.5),
	FCbest: new Decimal(0),
	FCtotal: new Decimal(0),
};

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	fairyCoins: new Decimal(0),
	elfCoins: new Decimal(0),
	angelCoins: new Decimal(0),
	goblinCoins: new Decimal(0),
	undeadCoins: new Decimal(0),
	demonCoins: new Decimal(0),
	FCchance: new Decimal(2.5),
	FC: new Decimal(0),
	bestGems: new Decimal(0),
	G: Object.create(playerStartingStats),
	R: Object.create(playerStartingStats),
	T: Object.create(playerStartingStats),
}};

// Display extra things at the top of the page
var displayThings = [
];

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1000000"))
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
