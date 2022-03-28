let modInfo = {
	name: "Realm Creator",
	id: "realm-creator-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["layers.js", "tree.js"],
	initialStartPoints: new Decimal (0),
	offlineLimit: 24,  // In hours
}

let VERSION = {
	num: "0.1",
	name: "Beta Test",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.1 - Beta Test</h3><br>
		- Added a clickable.<br>
		- Added three buyables.<br>
		- Added a stats menu.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints() {
	return true
}

function getPointGen() {
	let gain = new Decimal(0)
	if (getBuyableAmount('1', 12) > new Decimal(0)) gain = new Decimal(gain.add(getBuyableAmount('1', 12) * 0.2));
	if (getBuyableAmount('1', 13) > new Decimal(0)) gain = new Decimal(gain.add(getBuyableAmount('1', 13)));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	best: new Decimal(0),
	total: new Decimal(0),
	bestR: new Decimal(0),
	totalR: new Decimal(0),
	bestT: new Decimal(0),
	totalT: new Decimal(0),
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

// Style for the background, can be a function
var backgroundStyle = {
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1)
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}
