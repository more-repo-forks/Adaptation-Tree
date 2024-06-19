addLayer("co", {
	name: "Continent",
	symbol: "CO",
	position: 0,
	branches: ["ec", "sp", "r"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#55B020",
	nodeStyle() {if (tmp.co.canReset || player.co.unlocked) return {"background": "border-box linear-gradient(to right, #116022, #55B020, #B44990)"}},
	resource: "continents",
	row: 5,
	baseResource: "species",
	baseAmount() {return player.sp.points},
	requires: new Decimal(100000),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Explore for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(5).pow(player.co.points),
		new Decimal(10).pow(player.co.points),
		player.co.points.div(4).add(1),
	]},
	effectDescription() {return "which are dividing the ecosystem requirement by /" + format(tmp.co.effect[0]) + ", dividing the revolution requirement by /" + format(tmp.co.effect[1]) + ", and directly multiplying species gain by " + format(tmp.co.effect[2]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "You keep hybridization completions on continent resets.<br><br>After exploring 1 time, automation for influence is unlocked.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 16 || player.co.unlocked},
	hotkeys: [{
		key: "o",
		description: "O: reset for continents",
		onPress() {if (player.co.unlocked) doReset("co")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("co", keep);
	},
	componentStyles: {
		"prestige-button"() {if (tmp.co.canReset && tmp.co.nodeStyle) return tmp.co.nodeStyle},
	},
});

addNode("blank", {
	symbol: "T",
	branches: ["ex", "d", "w"],
	position: 2,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked() {return "Reach 100,000 domination points to unlock (You have " + formatWhole(player.d.points) + " domination points)"},
	row: 5,
	layerShown() {return challengeCompletions("ec", 11) >= 16},
});
