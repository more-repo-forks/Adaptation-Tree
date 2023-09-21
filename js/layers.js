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
		if (hasUpgrade("s", 21)) mult = mult.mul(upgradeEffect("s", 21));
		if (hasUpgrade("s", 22)) mult = mult.mul(upgradeEffect("s", 22));
		if (hasUpgrade("s", 23)) mult = mult.mul(upgradeEffect("s", 23));
		if (hasUpgrade("s", 24)) mult = mult.mul(upgradeEffect("s", 24));
		if (hasUpgrade("s", 25)) mult = mult.mul(upgradeEffect("s", 25));
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
			description: "increase base power gain based on the number of upgrades",
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
		21: {
			title: "Seeking",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(15000),
			unlocked() {return hasUpgrade("s", 15)},
		},
		22: {
			title: "Taunting",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(25000),
			unlocked() {return hasUpgrade("s", 21)},
		},
		23: {
			title: "Tracking",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(45000),
			unlocked() {return hasUpgrade("s", 22)},
		},
		24: {
			title: "Luring",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(100000),
			unlocked() {return hasUpgrade("s", 23)},
		},
		25: {
			title: "Hunting",
			description: "multiply stimulation gain based on the number of upgrades",
			effect() {return player.s.upgrades.length ** 0.5},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(250000),
			unlocked() {return hasUpgrade("s", 24)},
		},
		31: {
			title: "Recuperation",
			description: "multiply power gain by 3",
			effect() {return 3},
			cost: new Decimal(500000),
			unlocked() {return hasUpgrade("s", 25)},
		},
		32: {
			title: "Repetition",
			description: "multiply power gain by 3",
			effect() {return 3},
			cost: new Decimal(1000000),
			unlocked() {return hasUpgrade("s", 31)},
		},
		33: {
			title: "Restoration",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost: new Decimal(2500000),
			unlocked() {return hasUpgrade("s", 32)},
		},
		34: {
			title: "Training",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost: new Decimal(7500000),
			unlocked() {return hasUpgrade("s", 33)},
		},
		35: {
			title: "Growth",
			description: "multiply power gain by 5 and unlock a new layer",
			effect() {return 5},
			cost: new Decimal(25000000),
			unlocked() {return hasUpgrade("s", 34)},
		},
	},
});
