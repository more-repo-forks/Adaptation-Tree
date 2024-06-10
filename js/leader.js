addLayer("l", {
	name: "Leader",
	symbol: "L",
	position: 1,
	branches: [["ec", 2], "r", "cb", "ex", ["w", 2]],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#E5B55A",
	nodeStyle() {if (tmp.l.canReset || player.l.unlocked) return {"background": "border-box linear-gradient(to right, #55B020, #E5B55A, #E03330)"}},
	resource: "leaders",
	row: 5,
	baseResource: "conscious beings",
	baseAmount() {return player.cb.points},
	requires: new Decimal(250000),
	type: "static",
	base: 2,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Lead for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(2).pow(player.l.points),
		new Decimal(2).pow(player.l.points),
		player.l.points.div(4).add(1),
		player.l.points.add(1),
	]},
	effectDescription() {return "which are multiplying power and stimulation gain by " + format(tmp.l.effect[0]) + "x; dividing the requirements of all resources from rows 2-5 by /" + format(tmp.l.effect[1]) + "; directly multiplying conscious being gain by " + format(tmp.l.effect[2]) + "x; and multiplying focus gain, focus limit, and influence generator production by " + format(tmp.l.effect[3]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "After leading 1 time, more automation for domination is always unlocked,<br>species resets (that are not in hybridizations) no longer reset anything,<br>and you automatically claim potential species.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.l.points.gte(1)) text += "<br><br>After leading 2 times, you keep retrogression completions on all resets,<br>domination resets (without respec) no longer reset anything,<br>and you automatically claim potential domination points.";
			return text;
		}],
		"blank",
	],
	layerShown() {return hasMilestone("d", 39) || player.l.unlocked},
	hotkeys: [{
		key: "l",
		description: "L: reset for leaders",
		onPress() {if (player.l.unlocked) doReset("l")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("l", keep);
	},
	componentStyles: {
		"prestige-button"() {if (tmp.l.canReset && tmp.l.nodeStyle) return tmp.l.nodeStyle},
	},
});
