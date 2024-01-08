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
		if (hasUpgrade("s", 41)) mult = mult.mul(upgradeEffect("s", 41));
		if (hasUpgrade("s", 43)) mult = mult.mul(upgradeEffect("s", 43));
		if (hasUpgrade("s", 45)) mult = mult.mul(upgradeEffect("s", 45));
		if (hasBuyable("g", 12)) mult = mult.mul(buyableEffect("g", 12));
		return mult;
	},
	effect() {
		let exp = new Decimal(0.5);
		if (hasUpgrade("s", 52)) exp = exp.add(upgradeEffect("s", 52));
		if (hasUpgrade("s", 54)) exp = exp.add(upgradeEffect("s", 54));
		if (hasUpgrade("s", 55)) exp = exp.add(upgradeEffect("s", 55));
		return player.s.points.add(1).pow(exp);
	},
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
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
		},
		12: {
			title: "Experience",
			description: "increase base power gain by 1.5",
			effect() {return 1.5},
			cost() {
				let cost = new Decimal(25);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 11) || player.g.unlocked},
		},
		13: {
			title: "Memorization",
			description: "increase base power gain by 2.5",
			effect() {return 2.5},
			cost() {
				let cost = new Decimal(75);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 12) || player.g.unlocked},
		},
		14: {
			title: "Calculation",
			description: "increase base power gain based on the number of upgrades",
			effect() {return player.s.upgrades.length * 3},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(250);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 13) || player.g.unlocked},
		},
		15: {
			title: "Intelligence",
			description: "increase base power gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(100)},
			effectDisplay() {return "+" + format(this.effect())},
			cost() {
				let cost = new Decimal(1000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 14) || player.g.unlocked},
		},
		21: {
			title: "Seeking",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(15000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 15) || player.g.unlocked},
		},
		22: {
			title: "Taunting",
			description: "multiply stimulation gain by 1.5",
			effect() {return 1.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(25000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 21) || player.g.unlocked},
		},
		23: {
			title: "Tracking",
			description: "multiply stimulation gain by 2",
			effect() {return 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(45000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 22) || player.g.unlocked},
		},
		24: {
			title: "Luring",
			description: "multiply stimulation gain by 2.5",
			effect() {return 2.5},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(100000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 23) || player.g.unlocked},
		},
		25: {
			title: "Hunting",
			description: "multiply stimulation gain based on the number of upgrades",
			effect() {return Math.max(player.s.upgrades.length ** 0.5, 1) },
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost() {
				let cost = new Decimal(250000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 24) || player.g.unlocked},
		},
		31: {
			title: "Recuperation",
			description: "multiply power gain by 3",
			effect() {return 3},
			cost() {
				let cost = new Decimal(500000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 25) || player.g.unlocked},
		},
		32: {
			title: "Repetition",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(1000000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 31) || player.g.unlocked},
		},
		33: {
			title: "Restoration",
			description: "multiply power gain by 4",
			effect() {return 4},
			cost() {
				let cost = new Decimal(2500000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 32) || player.g.unlocked},
		},
		34: {
			title: "Training",
			description: "multiply power gain by 5",
			effect() {return 5},
			cost() {
				let cost = new Decimal(7500000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 33) || player.g.unlocked},
		},
		35: {
			title: "Growth",
			description: "multiply power gain by 5 and unlock a new layer",
			effect() {return 5},
			cost() {
				let cost = new Decimal(25000000);
				if (hasBuyable("g", 14) && !hasMilestone("g", 3)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return hasUpgrade("s", 34) || player.g.unlocked},
		},
		41: {
			title: "Calmness",
			description: "multiply stimulation gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(0.5).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e15),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(1)},
		},
		42: {
			title: "Consumption",
			description: "multiply power gain based on power",
			effect() {return player.points.add(1).log10().mul(0.75).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(2.5e16),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(2)},
		},
		43: {
			title: "Meditation",
			description: "multiply stimulation gain based on power",
			effect() {return player.points.add(1).log10().mul(0.45).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e18),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(3)},
		},
		44: {
			title: "Absorbtion",
			description: "multiply power gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(1.5).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(5e19),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(4)},
		},
		45: {
			title: "Assimilation",
			description: "multiply power and stimulation gain by 10",
			effect() {return 10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e22),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(5)},
		},
		51: {
			title: "Swiftness",
			description: "divide growth point requirement by 16",
			effect() {return 16},
			cost: new Decimal(2.5e20),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(6)},
		},
		52: {
			title: "Deregulation",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(5e21),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(7)},
		},
		53: {
			title: "Acceleration",
			description: "divide growth point requirement based on your power",
			effect() {return player.points.add(1).log10().mul(0.5).add(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(2.5e23),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(8)},
		},
		54: {
			title: "Freedom",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(2.5e25),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(9)},
		},
		55: {
			title: "Boundlessness",
			description: "increase stimulation effect exponent based on your growth points",
			effect() {return player.g.points.add(1).log10().mul(0.036)},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(2.5e28),
			unlocked() {return hasMilestone("g", 3) && buyableEffect("g", 14).gte(10)},
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
	canBuyMax() {return hasMilestone("g", 8)},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("s", 51)) mult = mult.div(upgradeEffect("s", 51));
		if (hasUpgrade("s", 53)) mult = mult.div(upgradeEffect("s", 53));
		if (hasBuyable("g", 13)) mult = mult.div(buyableEffect("g", 13));
		return mult;
	},
	effectDescription() {return "of which " + formatWhole(player.g.points.sub(player.g.spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		["row", [
			["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
			["display-text", () => {
				let max = getBuyableAmount("g", 11).max(getBuyableAmount("g", 12)).max(getBuyableAmount("g", 13)).max(getBuyableAmount("g", 14)).toNumber() + 1;
				if (max < 2) max = 2;
				let text = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
				text += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#80808080'/>";
				text += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#80808080'/>";
				text += "<circle cx='50' cy='50' r='0.5' fill='none' stroke='#808080'/>";
				let rectMax = max;
				if (rectMax >= 16) {
					rectMax = max / (2 ** Math.floor(Math.log2(max) - 3));
				};
				for (let index = 0; index < rectMax; index++) {
					let low = (index / rectMax * 45) + 5.5;
					let high = ((rectMax - index) / rectMax * 90) - 1;
					text += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
				};
				let stats = [getBuyableAmount("g", 11).toNumber() + 1, getBuyableAmount("g", 13).toNumber() + 1, getBuyableAmount("g", 14).toNumber() + 1, getBuyableAmount("g", 12).toNumber() + 1];
				let statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				let statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff80' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				return text + "</svg>";
			}],
			["column", [["buyable", 13], ["blank", "75px"], ["buyable", 14]]],
		]],
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
		"buyable"() {return {'width': '210px', 'height': '90px'}},
	},
	buyables: {
		11: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				if (hasMilestone("g", 6)) base = base.mul(milestoneEffect("g", 6));
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
			effectBase() {
				let base = new Decimal(4);
				if (hasMilestone("g", 4)) base = base.add(milestoneEffect("g", 4));
				if (hasMilestone("g", 5)) base = base.add(milestoneEffect("g", 5));
				if (hasMilestone("g", 9)) base = base.add(milestoneEffect("g", 9));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "(AGI)LITY",
			display() {return "divide growth point requirement by " + formatWhole(this.effectBase()) + "<br>(min requirement: 100,000,000)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points"},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost())},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				if (hasMilestone("g", 3)) {
					let base = new Decimal(1);
					if (hasMilestone("g", 7)) base = base.add(milestoneEffect("g", 7));
					return base;
				};
				return new Decimal(5);
			},
			effect() {
				if (hasMilestone("g", 3)) return getBuyableAmount(this.layer, this.id).mul(this.effectBase()).min(10);
				else return new Decimal(5).pow(getBuyableAmount(this.layer, this.id));
			},
			title: "(INT)ELLECT",
			display() {
				if (hasMilestone("g", 3)) {
					let base = this.effectBase();
					if (base.eq(1)) return "unlock a new stimulation upgrade<br>(maxes at 10 new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points";
					else return "unlock " + format(base) + " new stimulation upgrades<br>(maxes at 10 new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points";
				};
				return "divide previous upgrade costs by 5<br>(upgrade costs are rounded down)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " growth points";
			},
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
			requirementDescription: "WIS enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
		},
		1: {
			requirement: 9,
			requirementDescription: "STR enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.75).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		2: {
			requirement: 12,
			requirementDescription: "WIS enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.45).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		3: {
			requirement: 21,
			requirementDescription: "INT enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "change the base effect of INT<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		4: {
			requirement: 40,
			requirementDescription: "AGI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		5: {
			requirement: 48,
			requirementDescription: "AGI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		6: {
			requirement: 66,
			requirementDescription: "STR enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		7: {
			requirement: 70,
			requirementDescription: "INT enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {return "increase the base effect of INT by 0.25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		8: {
			requirement: 90,
			requirementDescription: "Growth enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock bulk growth<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		9: {
			requirement: 101,
			requirementDescription: "AGI enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base effect of AGI by 8<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
	},
});
