addLayer("ex", {
	name: "Expansion",
	symbol: "EX",
	position: 2,
	branches: ["cb", "a", "d"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#B3478F",
	nodeStyle() {if (tmp.ex.canReset || player.ex.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #B3478F, #E03330)"}},
	resource: "expansion points",
	row: 4,
	baseResource: "acclimation points",
	baseAmount() {return player.a.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (challengeCompletions("ec", 11) >= 6 && challengeEffect("ec", 11)[5]) base -= challengeEffect("ec", 11)[5];
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Expand your influence for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(5).pow(player.ex.points),
		new Decimal(10).pow(player.ex.points),
		player.ex.points.mul(player.r.points.gte(3) ? 300 : 100),
	]},
	effectDescription() {return "which are dividing the conscious being requirement by /" + format(tmp.ex.effect[0]) + ", dividing domination requirement by /" + format(tmp.ex.effect[1]) + ", and giving " + formatWhole(tmp.ex.effect[2]) + " extra CRA, FER, ANA, and SOV"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "After expanding 1 time, you keep acclimation enhancements on all resets,<br>acclimation resets (without respec) no longer reset anything,<br>and you automatically claim potential acclimation points.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.r.points.gte(2)) text += "<br><br>After expanding 3 times, the last expansion effect is improved.";
			return text;
		}],
		"blank",
		"milestones",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.ex.unlocked},
	hotkeys: [{
		key: "x",
		description: "X: reset for expansion points",
		onPress() {if (player.ex.unlocked) doReset("ex")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("ex", keep);
	},
	componentStyles: {
		"prestige-button"() {if (tmp.ex.canReset && tmp.ex.nodeStyle) return tmp.ex.nodeStyle},
	},
});

addNode("blank", {
	symbol: "W",
	branches: ["d"],
	position: 3,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked: "coming soon!",
	row: 4,
	layerShown() {return challengeCompletions("ec", 11) >= 2},
});
