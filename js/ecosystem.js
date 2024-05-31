addLayer("ec", {
	name: "Ecosystem",
	symbol: "EC",
	position: 0,
	branches: ["sp"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#116022",
	resource: "ecosystems",
	row: 4,
	baseResource: "species",
	baseAmount() {return player.sp.points},
	requires: new Decimal(30),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Ecologically succeed for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(5).pow(player.ec.points),
		player.ec.points.mul(5),
		new Decimal(100).pow(player.ec.points).min(1e300),
	]},
	effectDescription() {return "which are dividing the species requirement by /" + format(tmp.ec.effect[0]) + ", increasing the completion limit of the 10th hybridization by +" + format(tmp.ec.effect[1]) + ", and generating +" + format(tmp.ec.effect[2]) + "% of potential stimulations per second"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => "You keep hybridization completions on ecosystem resets.<br><br>After succeeding 1 time, more automation for acclimation is always unlocked<br>and you can always bulk species, conscious beings, and domination points.<br><br>The above extra effects will not go away even if this layer is reset.<br><br><br><br><h2><b style='color: #116022; text-shadow: 0 0 10px #116022'>ANACHRONISM</b> is coming soon!</h2>"],
		"blank",
	],
	layerShown() {return hasChallenge("sp", 19) || player.ec.unlocked},
	hotkeys: [{
		key: "c",
		description: "C: reset for ecosystems",
		onPress() {if (player.ec.unlocked) doReset("ec")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("ec", keep);
	},
});
