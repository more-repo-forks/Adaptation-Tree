addLayer("t", {
	name: "Territory",
	symbol: "T",
	position: 2,
	branches: ["ex", "d", "w"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#E03330",
	nodeStyle() {if (tmp.t.canReset || player.t.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #E03330, #C77055)"}},
	resource: "territories",
	row: 5,
	baseResource: "domination points",
	baseAmount() {return player.d.points},
	requires: new Decimal(100000),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Subjugate for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(10).pow(player.t.points),
		new Decimal(5).pow(player.t.points),
		player.t.points.div(4).add(1),
	]},
	effectDescription() {return "which are dividing the expansion requirement by /" + format(tmp.t.effect[0]) + ", dividing the war requirement by /" + format(tmp.t.effect[1]) + ", and directly multiplying domination point gain by " + format(tmp.t.effect[2]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "You keep domination enhancements on continent resets.<br><br>After subjugating 1 time, you bulk 10x stats from rows 3 and below.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
		["challenge", 11],
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 16 || player.t.unlocked},
	hotkeys: [{
		key: "t",
		description: "T: reset for territories",
		onPress() {if (player.t.unlocked) doReset("t")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("t", keep);
	},
	componentStyles: {
		"prestige-button"() {if (tmp.t.canReset && tmp.t.nodeStyle) return tmp.t.nodeStyle},
	},
});
