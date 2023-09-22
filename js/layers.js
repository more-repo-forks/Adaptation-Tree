addLayer("s", {
	name: "Stimulation",
	symbol: "S",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#73F0B4",
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
		if (hasBuyable("g", 12)) mult = mult.mul(buyableEffect("g", 12));
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
			cost() {
				let cost = new Decimal(10);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
		},
		12: {
			title: "Experience",
			description: "increase base power gain by 1.5",
			effect() {return 1.5},
			cost() {
				let cost = new Decimal(25);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 11)},
		},
		13: {
			title: "Memorization",
			description: "increase base power gain by 2.5",
			effect() {return 2.5},
			cost() {
				let cost = new Decimal(75);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 12)},
		},
		14: {
			title: "Calculation",
			description: "increase base power gain based on the number of upgrades",
			effect() {return player.s.upgrades.length * 3},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(250);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 13)},
		},
		15: {
			title: "Intelligence",
			description: "increase base power gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(100)},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(1000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 14)},
		},
		21: {
			title: "Seeking",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(15000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 15)},
		},
		22: {
			title: "Taunting",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(25000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 21)},
		},
		23: {
			title: "Tracking",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(45000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 22)},
		},
		24: {
			title: "Luring",
			description: "multiply stimulation gain by 2.5",
			effect() {return 2.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(100000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 23)},
		},
		25: {
			title: "Hunting",
			description: "multiply stimulation gain based on the number of upgrades",
			effect() {return player.s.upgrades.length ** 0.5},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(250000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 24)},
		},
		31: {
			title: "Recuperation",
			description: "multiply power gain by 3",
			effect() {return 3},
			cost() {
				let cost = new Decimal(500000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 25)},
		},
		32: {
			title: "Repetition",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(1000000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 31)},
		},
		33: {
			title: "Restoration",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(2500000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 32)},
		},
		34: {
			title: "Training",
			description: "multiply power gain by 5",
			effect() {return 5},
			cost() {
				let cost = new Decimal(7500000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 33)},
		},
		35: {
			title: "Growth",
			description: "multiply power gain by 5 and unlock a new layer",
			effect() {return 5},
			cost() {
				let cost = new Decimal(25000000);
				if (hasBuyable("g", 14)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 34)},
		},
	},
});

addLayer("g", {
	name: "Growth",
	symbol: "G",
	position: 0,
	branches: ["s"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
	}},
	color: "#E6B45A",
	resource: "growth points",
	row: 1,
	baseResource: "stimulations",
	baseAmount() {return player.s.points},
	requires: new Decimal(100000000),
	type: "static",
	base: 2,
	exponent: 1,
	gainMult() {
		let mult = new Decimal(1);
		if (hasBuyable("g", 13)) mult = mult.div(buyableEffect("g", 13));
		return mult;
	},
	effectDescription() {return "of which " + formatWhole(player.g.points.sub(player.g.spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		["row", [
			["column", [["buyable", 11], "blank", ["buyable", 12]]],
			"blank",
			["display-text", () => {return "<div id='growthStats'>STR: " + formatWhole(getBuyableAmount("g", 11)) + "<br>WIS: " + formatWhole(getBuyableAmount("g", 12)) + "<br>AGI: " + formatWhole(getBuyableAmount("g", 13)) + "<br>INT: " + formatWhole(getBuyableAmount("g", 14)) + "</div>"}],
			"blank",
			["column", [["buyable", 13], "blank", ["buyable", 14]]],
		]],
		"blank",
		"respec-button",
		"blank",
		"milestones",
	],
	layerShown() {return hasUpgrade("s", 35) || player.g.unlocked},
	hotkeys: [{
		key: "g",
		description: "G: reset for growth points",
		onPress() {if (player.g.unlocked) doReset("g")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("g", keep);
	},
	componentStyles: {
		"buyable"() {return {'height': '80px'}},
	},
	buyables: {
		11: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "(STR)ENGTH",
			display() {return "multiply power gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + format(this.cost()) + " growth points"},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost())},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
		},
		12: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("g", 0)) base = base.mul(milestoneEffect("g", 0));
				if (hasMilestone("g", 2)) base = base.mul(milestoneEffect("g", 2));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "(WIS)DOM",
			display() {return "multiply stimulation gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + format(this.cost()) + " growth points"},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost())},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
		},
		13: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effect() {return new Decimal(4).pow(getBuyableAmount(this.layer, this.id))},
			title: "(AGI)LITY",
			display() {return "divide growth point requirement by 4<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points"},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost())},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effect() {return new Decimal(5).pow(getBuyableAmount(this.layer, this.id))},
			title: "(INT)ELLECT",
			display() {return "divide previous upgrade costs by 5<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points"},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost())},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
		},
		respec() {
			setBuyableAmount("g", 11, new Decimal(0));
			setBuyableAmount("g", 12, new Decimal(0));
			setBuyableAmount("g", 13, new Decimal(0));
			setBuyableAmount("g", 14, new Decimal(0));
			player.g.spent = new Decimal(0);
			doReset("g", true);
		},
		respecText: "respec growth points",
	},
	milestones: {
		0: {
			requirement: 6,
			requirementDescription: "WIS enhancement 1",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
		},
		1: {
			requirement: 9,
			requirementDescription: "STR enhancement 1",
			effect() {return player.g.points.add(1).log10().mul(0.75).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		2: {
			requirement: 12,
			requirementDescription: "WIS enhancement 2",
			effect() {return player.g.points.add(1).log10().mul(0.45).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		3: {
			requirement: 21,
			requirementDescription: "Coming Soon",
			effectDescription() {return "Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return false},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
	},
});
