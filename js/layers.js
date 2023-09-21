addLayer("s", {
	name: "Stimulation",
	symbol: "S",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#999999",
	resource: "stimulations",
	row: 0,
	baseResource: modInfo.pointsName,
	baseAmount() {return player.points},
	requires: new Decimal(0.75),
	type: "normal",
	exponent: 0.5,
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {return player.s.points.add(1).pow(0.5)},
	effectDescription() {return "which are multiplying power gain by " + format(tmp.s.effect) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		"upgrades",
	],
	layerShown() {return player.s.unlocked},
	hotkeys: [{
		key: "s",
		description: "S: reset for stimulations",
		onPress() {if (player.s.unlocked) doReset("s")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("s", keep);
	},
	upgrades: {
		11: {
			title: "Learning",
			description: "increase base power gain by 1",
			effect() {return 1},
			cost: new Decimal(10),
			unlocked() {return true},
		},
		12: {
			title: "Experience",
			description: "increase base power gain by 1.5",
			effect() {return 1.5},
			cost: new Decimal(25),
			unlocked() {return hasUpgrade("s", 11)},
		},
		13: {
			title: "Memorization",
			description: "increase base power gain by 2.5",
			effect() {return 2.5},
			cost: new Decimal(75),
			unlocked() {return hasUpgrade("s", 12)},
		},
		14: {
			title: "Calculation",
			description: "increase base power gain by 2 times the number of upgrades",
			effect() {return player.s.upgrades.length * 2},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(250),
			unlocked() {return hasUpgrade("s", 13)},
		},
		15: {
			title: "Intelligence",
			description: "increase base power gain based on stimulations",
			effect() {return player.s.points.add(1).pow(100).log10()},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(1000),
			unlocked() {return hasUpgrade("s", 14)},
		},
	},
});
