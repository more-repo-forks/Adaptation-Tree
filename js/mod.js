let modInfo = {
	name: "Realm Creator",
	id: "realm-creator-yrahcaz7",
	author: "Yrahcaz7",
	pointsName: "coins",
	modFiles: ["layers.js", "tree.js"],
	initialStartPoints: new Decimal (0),
	offlineLimit: 1,  // In hours
}

let VERSION = {
	num: "0.4",
	name: "Super Beta",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h3>v0.4 - Super Beta</h3><br>
		- Added 1 gem power upgrade.<br>
		- Added 1 autocating upgrades.<br>
		- Added 2 autocasters.<br>
		- Added 2 angel upgrades.<br>
		- Added 3 demon upgrades.<br>
		- Added relevant mana stats to casting menu.<br>
		- Minor fixes.<br>
	<br><h3>v0.3 - Spells Beta</h3><br>
		- Added five new creation tiers.<br>
		- Added casting, mana, and spells.<br>
		- Added 2 normal spells.<br>
		- Added 2 side spells.<br>
		- Added 2 mana upgrades.<br>
		- Added 3 fairy upgrades.<br>
		- Added 6 goblin upgrades.<br>
		- Added more types of stats to the stat menu.<br>
		- Minor fixes.<br>
	<br><h3>v0.2 - Factions Beta</h3><br>
		- Added five new creation tiers.<br>
		- Added faction coins.<br>
		- Added choosing a faction.<br>
		- Added a new tab for faction stuff.<br>
		- Fixed various issues with the stats menu.<br>
		- Added faction coin stats to the stat menu.<br>
	<br><h3>v0.1 - Beta Test</h3><br>
		- Added the click button.<br>
		- Added three creations.<br>
		- Added a stats menu.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function randint(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function callcast() {
	player['2'].calltime = new Decimal(30);
    player['2'].mana = player['2'].mana.sub(160);
    player['2'].callcasts = player['2'].callcasts.add(1);
    player['2'].callcastsR = player['2'].callcastsR.add(1);
    player['2'].callcastsT = player['2'].callcastsT.add(1);
    setClickableState('2', 12, "ON");
}

function sidespellcast() {
	player['2'].sidespelltime = new Decimal(15);
    player['2'].mana = player['2'].mana.sub(120);
        if (hasUpgrade('1', 11))
            player['2'].holycasts = player['2'].holycasts.add(1),
            player['2'].holycastsR = player['2'].holycastsR.add(1),
            player['2'].holycastsT = player['2'].holycastsT.add(1);
        if (hasUpgrade('1', 21))
            player['2'].frenzycasts = player['2'].frenzycasts.add(1),
            player['2'].frenzycastsR = player['2'].frenzycastsR.add(1),
        player['2'].frenzycastsT = player['2'].frenzycastsT.add(1);
    setClickableState('2', 13, "ON");
}

function getStartPoints() {
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints() {
	return true
}

function getPointGen() {
	let gain = new Decimal(0);
	// addtitive
	if (getBuyableAmount('1', 12).gt(0)) gain = gain.add(getBuyableAmount('1', 12) * buyableEffect('1', 12));
	if (getBuyableAmount('1', 13).gt(0)) gain = gain.add(getBuyableAmount('1', 13) * buyableEffect('1', 13));
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
	fairyCoins: new Decimal(0),
	elfCoins: new Decimal(0),
	angelCoins: new Decimal(0),
	goblinCoins: new Decimal(0),
	undeadCoins: new Decimal(0),
	demonCoins: new Decimal(0),
	FCchance: new Decimal(2.5),
	FCchancebest: new Decimal(2.5),
	FCchancebestT: new Decimal(2.5),
	_FC: new Decimal(0),
	FCbest: new Decimal(0),
	FCbestR: new Decimal(0),
	FCbestT: new Decimal(0),
	FCtotal: new Decimal(0),
	FCtotalR: new Decimal(0),
	FCtotalT: new Decimal(0),
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
