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
		if (hasUpgrade("s", 65)) mult = mult.mul(upgradeEffect("s", 65));
		mult = mult.mul(buyableEffect("g", 12));
		return mult;
	},
	effect() {
		let exp = new Decimal(0.5);
		if (hasUpgrade("s", 52)) exp = exp.add(upgradeEffect("s", 52));
		if (hasUpgrade("s", 54)) exp = exp.add(upgradeEffect("s", 54));
		if (hasUpgrade("s", 55)) exp = exp.add(upgradeEffect("s", 55));
		if (hasUpgrade("s", 71)) exp = exp.add(upgradeEffect("s", 71));
		if (hasUpgrade("s", 72)) exp = exp.add(upgradeEffect("s", 72));
		if (hasUpgrade("s", 73)) exp = exp.add(upgradeEffect("s", 73));
		if (hasUpgrade("s", 74)) exp = exp.add(upgradeEffect("s", 74));
		if (hasUpgrade("s", 75)) exp = exp.add(upgradeEffect("s", 75));
		if (hasChallenge("e", 11)) exp = exp.add(buyableEffect("g", 14));
		return player.s.points.add(1).pow(exp);
	},
	effectDescription() {return "which are multiplying power gain by " + format(tmp.s.effect) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		"upgrades",
	],
	layerShown() {return player.s.unlocked},
	passiveGeneration() {
		let gen = 0;
		if (player.e.unlocked && tmp.e.effect[4]) gen += tmp.e.effect[4].toNumber() / 100;
		return gen;
	},
	hotkeys: [{
		key: "s",
		description: "S: reset for stimulations",
		onPress() {if (player.s.unlocked) doReset("s")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (resettingLayer == "g" && hasMilestone("g", 8) && hasChallenge("e", 11)) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) {
			let keepUpg = [];
			if (resettingLayer == "g" && ((hasMilestone("g", 8) && player.e.unlocked) || (!hasMilestone("g", 8) && hasChallenge("e", 11)))) {
				for (let index = 0; index < player.s.upgrades.length; index++) {
					if (player.s.upgrades[index] < 40) keepUpg.push(player.s.upgrades[index]);
				};
			};
			layerDataReset("s", keep);
			if (!keep.includes("upgrades")) {
				player.s.upgrades = keepUpg;
			};
		};
	},
	upgrades: {
		11: {
			title: "Learning",
			description: "increase base power gain by 1",
			effect() {return 1},
			cost() {
				let cost = new Decimal(10);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
		},
		12: {
			title: "Experience",
			description: "increase base power gain by 1.5",
			effect() {return 1.5},
			cost() {
				let cost = new Decimal(25);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
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
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(1)) || hasChallenge("e", 11)},
		},
		42: {
			title: "Consumption",
			description: "multiply power gain based on power",
			effect() {return player.points.add(1).log10().mul(0.75).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(2.5e16),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(2)) || hasChallenge("e", 11)},
		},
		43: {
			title: "Meditation",
			description: "multiply stimulation gain based on power",
			effect() {
				if (hasUpgrade("s", 63)) return player.points.add(1).pow(0.05);
				else return player.points.add(1).log10().mul(0.45).add(1);
			},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e18),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(3)) || hasChallenge("e", 11)},
		},
		44: {
			title: "Absorbtion",
			description: "multiply power gain based on stimulations",
			effect() {
				if (hasUpgrade("s", 64)) return player.s.points.add(1).pow(0.088);
				else return player.s.points.add(1).log10().mul(1.5).add(1);
			},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(5e19),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(4)) || hasChallenge("e", 11)},
		},
		45: {
			title: "Assimilation",
			description: "multiply power and stimulation gain by 10",
			effect() {return 10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e22),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(5)) || hasChallenge("e", 11)},
		},
		51: {
			title: "Swiftness",
			description: "divide growth point requirement by 16",
			effect() {return 16},
			cost: new Decimal(2.5e20),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(6)) || hasChallenge("e", 11)},
		},
		52: {
			title: "Deregulation",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(5e21),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(7)) || hasChallenge("e", 11)},
		},
		53: {
			title: "Acceleration",
			description: "divide growth point requirement based on your power",
			effect() {
				if (hasUpgrade("s", 62)) return player.points.mul(1e10).add(1).pow(0.05);
				else return player.points.add(1).log10().mul(0.5).add(1);
			},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(2.5e23),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(8)) || hasChallenge("e", 11)},
		},
		54: {
			title: "Freedom",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(2.5e25),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(9)) || hasChallenge("e", 11)},
		},
		55: {
			title: "Boundlessness",
			description: "increase stimulation effect exponent based on your growth points",
			effect() {
				if (hasUpgrade("s", 61)) return player.g.points.add(1).pow(0.1).div(10);
				else return player.g.points.add(1).log10().mul(0.036);
			},
			effectDisplay() {return "+" + format(this.effect())},
			cost: new Decimal(2.5e28),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(10)) || hasChallenge("e", 11)},
		},
		61: {
			title: "Limitlessness",
			description: "improve the effect formula of <b>Boundlessness</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e50),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(11)) || hasChallenge("e", 11)},
		},
		62: {
			title: "Windlessness",
			description: "improve the effect formula of <b>Acceleration</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e60),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(12)) || hasChallenge("e", 11)},
		},
		63: {
			title: "Enlightenment",
			description: "improve the effect formula of <b>Meditation</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e71),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(13)) || hasChallenge("e", 11)},
		},
		64: {
			title: "Gorging",
			description: "improve the effect formula of <b>Absorbtion</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e84),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(14)) || hasChallenge("e", 11)},
		},
		65: {
			title: "Integration",
			description: "apply the effects of <b>Assimilation</b> two more times",
			effect() {return upgradeEffect("s", 45) ** 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e100),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(15)) || hasChallenge("e", 11)},
		},
		71: {
			title: "Loosening",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e190),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(16)) || hasChallenge("e", 11)},
		},
		72: {
			title: "Passing",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e215),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(17)) || hasChallenge("e", 11)},
		},
		73: {
			title: "Breaking",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e245),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(18)) || hasChallenge("e", 11)},
		},
		74: {
			title: "Exceeding",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e295),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(19)) || hasChallenge("e", 11)},
		},
		75: {
			title: "Break the Limit",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal("1e345"),
			unlocked() {return (hasMilestone("g", 3) && buyableEffect("g", 14).gte(20)) || hasChallenge("e", 11)},
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
	base() {
		let base = 2;
		if (hasMilestone("g", 18)) base -= milestoneEffect("g", 18);
		if (hasMilestone("g", 25)) base -= milestoneEffect("g", 25);
		return base;
	},
	exponent: 1,
	canBuyMax() {return hasMilestone("g", 8) || player.e.unlocked},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("s", 51)) mult = mult.div(upgradeEffect("s", 51));
		if (hasUpgrade("s", 53)) mult = mult.div(upgradeEffect("s", 53));
		mult = mult.div(buyableEffect("g", 13));
		return mult;
	},
	effectDescription() {return "of which " + formatWhole(player.g.points.sub(player.g.spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["row", [
			["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
			["display-text", () => {
				let max = getBuyableAmount("g", 11).add(tmp.g.buyables[11].extra).max(getBuyableAmount("g", 12).add(tmp.g.buyables[12].extra)).max(getBuyableAmount("g", 13).add(tmp.g.buyables[13].extra)).max(getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra)).toNumber() + 1;
				if (max < 2) max = 2;
				let text = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
				text += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
				text += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
				let rectMax = max;
				if (rectMax >= 16) {
					rectMax = max / (2 ** Math.floor(Math.log2(max) - 3));
				};
				if (rectMax % 1 == 0) {
					text += "<circle cx='50' cy='50' r='0.5' fill='none' stroke='#808080'/>";
				};
				for (let index = 0; index < rectMax; index++) {
					let low = (index / rectMax * 45) + 5.5;
					let high = ((rectMax - index) / rectMax * 90) - 1;
					text += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
				};
				// normal stats
				let stats = [
					getBuyableAmount("g", 11).toNumber() + 1,
					getBuyableAmount("g", 13).toNumber() + 1,
					getBuyableAmount("g", 14).toNumber() + 1,
					getBuyableAmount("g", 12).toNumber() + 1,
				];
				let statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				let statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				// extra stats
				stats = [
					getBuyableAmount("g", 11).add(tmp.g.buyables[11].extra).toNumber() + 1,
					getBuyableAmount("g", 13).add(tmp.g.buyables[13].extra).toNumber() + 1,
					getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra).toNumber() + 1,
					getBuyableAmount("g", 12).add(tmp.g.buyables[12].extra).toNumber() + 1,
				];
				statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				// return
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
		if (layers[resettingLayer].row > this.row) {
			let keepMile = [];
			if (resettingLayer == "e" && hasChallenge("e", 12)) {
				for (let index = 0; index < player.g.milestones.length; index++) {
					if (player.g.milestones[index] < 16) keepMile.push(player.g.milestones[index]);
				};
			};
			layerDataReset("g", keep);
			if (!keep.includes("milestones")) {
				player.g.milestones = keepMile;
			};
		};
	},
	componentStyles: {
		"buyable"() {return {'width': '210px', 'height': '110px'}},
	},
	buyables: {
		11: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				return amt.add(1).max(0);
			},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				if (hasMilestone("g", 6)) base = base.mul(milestoneEffect("g", 6));
				if (hasMilestone("g", 11)) base = base.mul(milestoneEffect("g", 11));
				if (hasMilestone("g", 14)) base = base.mul(milestoneEffect("g", 14));
				if (hasMilestone("g", 21)) base = base.mul(milestoneEffect("g", 21));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(STR)ENGTH",
			display() {return "multiply power gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost()) && !inChallenge("e", 12)},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
			extra() {return tmp.e.effect[0] ? tmp.e.effect[0] : new Decimal(0)},
		},
		12: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				return amt.add(1).max(0);
			},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("g", 0)) base = base.mul(milestoneEffect("g", 0));
				if (hasMilestone("g", 2)) base = base.mul(milestoneEffect("g", 2));
				if (hasMilestone("g", 10)) base = base.mul(milestoneEffect("g", 10));
				if (hasMilestone("g", 17)) base = base.mul(milestoneEffect("g", 17));
				if (hasMilestone("g", 20)) base = base.mul(milestoneEffect("g", 20));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(WIS)DOM",
			display() {return "multiply stimulation gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost()) && !inChallenge("e", 12)},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
			extra() {return tmp.e.effect[1] ? tmp.e.effect[1] : new Decimal(0)},
		},
		13: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				return amt.add(1).max(0);
			},
			effectBase() {
				let base = new Decimal(4);
				if (hasMilestone("g", 4)) base = base.add(milestoneEffect("g", 4));
				if (hasMilestone("g", 5)) base = base.add(milestoneEffect("g", 5));
				if (hasMilestone("g", 9)) base = base.add(milestoneEffect("g", 9));
				if (hasMilestone("g", 16)) base = base.add(milestoneEffect("g", 16));
				if (hasMilestone("g", 22)) base = base.add(milestoneEffect("g", 22));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(AGI)LITY",
			display() {return "divide growth point requirement by " + formatWhole(this.effectBase()) + "<br>(min requirement: 100,000,000)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost()) && !inChallenge("e", 12)},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
			extra() {return tmp.e.effect[2] ? tmp.e.effect[2] : new Decimal(0)},
		},
		14: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				return amt.add(1).max(0);
			},
			maxEffect() {
				if (hasMilestone("g", 3) && !hasChallenge("e", 11)) {
					let max = new Decimal(10);
					if (hasMilestone("g", 13)) max = max.add(milestoneEffect("g", 13));
					if (hasMilestone("g", 23)) max = max.add(milestoneEffect("g", 23));
					return max;
				};
			},
			effectBase() {
				if (hasChallenge("e", 11)) {
					let base = new Decimal(0.005);
					if (hasMilestone("g", 26)) base = base.add(milestoneEffect("g", 26));
					return base;
				};
				if (hasMilestone("g", 3)) {
					let base = new Decimal(1);
					if (hasMilestone("g", 7)) base = base.add(milestoneEffect("g", 7));
					if (hasMilestone("g", 12)) base = base.add(milestoneEffect("g", 12));
					return base;
				};
				return new Decimal(5);
			},
			effect() {
				if (hasChallenge("e", 11)) return getBuyableAmount(this.layer, this.id).add(this.extra()).pow(0.75).mul(this.effectBase());
				else if (hasMilestone("g", 3)) return getBuyableAmount(this.layer, this.id).add(this.extra()).mul(this.effectBase()).min(this.maxEffect());
				else return new Decimal(5).pow(getBuyableAmount(this.layer, this.id).add(this.extra()));
			},
			title: "(INT)ELLECT",
			display() {
				if (hasChallenge("e", 11)) {
					return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br>(effective INT is powered to 0.75)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				if (hasMilestone("g", 3)) {
					let base = this.effectBase();
					if (base.eq(1)) return "unlock a new stimulation upgrade<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else return "unlock " + format(base) + " new stimulation upgrades<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				return "divide previous upgrade costs by 5<br>(upgrade costs are rounded down)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
			},
			canAfford() {return player.g.points.sub(player.g.spent).gte(this.cost()) && !inChallenge("e", 11)},
			buy() {
				player.g.spent = player.g.spent.add(this.cost());
				addBuyables("g", this.id, 1);
			},
			extra() {return tmp.e.effect[3] ? tmp.e.effect[3] : new Decimal(0)},
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
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		2: {
			requirement: 12,
			requirementDescription: "WIS enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.45).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		3: {
			requirement: 21,
			requirementDescription: "INT enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "change the base effect of INT<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		4: {
			requirement: 40,
			requirementDescription: "AGI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		5: {
			requirement: 48,
			requirementDescription: "AGI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		6: {
			requirement: 66,
			requirementDescription: "STR enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		7: {
			requirement: 70,
			requirementDescription: "INT enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.25<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		8: {
			requirement: 90,
			requirementDescription: "Growth enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (hasChallenge("e", 11)) return "keep all stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (player.e.unlocked) return "keep the first fifteen stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock bulk growth<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		9: {
			requirement: 101,
			requirementDescription: "AGI enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base effect of AGI by 8<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		10: {
			requirement: 121,
			requirementDescription: "WIS enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		11: {
			requirement: 140,
			requirementDescription: "STR enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.5).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		12: {
			requirement: 150,
			requirementDescription: "INT enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.75},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.75<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		13: {
			requirement: 166,
			requirementDescription: "INT enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		14: {
			requirement: 196,
			requirementDescription: "STR enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		15: {
			requirement: 300,
			requirementDescription: "Evolution enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock a new layer<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		16: {
			requirement: 400,
			requirementDescription: "AGI enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 16},
			effectDescription() {return "increase the base effect of AGI by 16<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		17: {
			requirement: 420,
			requirementDescription: "WIS enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		18: {
			requirement: 488,
			requirementDescription: "Growth enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the base growth requirement by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		19: {
			requirement: 525,
			requirementDescription: "Evolution enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5},
			effectDescription() {return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		20: {
			requirement: 575,
			requirementDescription: "WIS enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.15).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		21: {
			requirement: 640,
			requirementDescription: "STR enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		22: {
			requirement: 715,
			requirementDescription: "AGI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 32},
			effectDescription() {return "increase the base effect of AGI by 32<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		23: {
			requirement: 788,
			requirementDescription: "INT enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		24: {
			requirement: 1725,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return hasChallenge("e", 11) ? 1.5 : 1},
			effectDescription() {
				if (hasChallenge("e", 11)) return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock something new in the evolution layer<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		25: {
			requirement: 2000,
			requirementDescription: "Growth enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.07},
			effectDescription() {return "decrease the base growth requirement by 0.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
		26: {
			requirement: 2666,
			requirementDescription: "INT enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.003},
			effectDescription() {return "increase the base effect of INT by 0.003<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1)},
		},
	},
});

addLayer("e", {
	name: "Evolution",
	symbol: "E",
	position: 0,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		challengesUnlocked: 0,
	}},
	color: "#ED6A5E",
	resource: "evolutions",
	row: 2,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(300),
	type: "static",
	base: 1.5,
	exponent: 1,
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("g", 19)) mult = mult.div(milestoneEffect("g", 19));
		if (hasMilestone("g", 24) && hasChallenge("e", 11)) mult = mult.div(milestoneEffect("g", 24));
		return mult;
	},
	effect() {
		let mult = [1, 1, 2, 0.5, 0.25];
		if (player.e.points.gte(6)) mult[4] *= 8;
		if (hasChallenge("e", 12)) mult[3] *= 4;
		return [
			player.e.points.mul(mult[0]).floor(),
			player.e.points.mul(mult[1]).floor(),
			player.e.points.mul(mult[2]).floor(),
			player.e.points.mul(mult[3]).floor(),
			player.e.points.mul(mult[4]).min(100),
		];
	},
	effectDescription() {return "which are giving " + formatWhole(tmp.e.effect[0]) + " extra STR, " + formatWhole(tmp.e.effect[1]) + " extra WIS, " + formatWhole(tmp.e.effect[2]) + " extra AGI, and " + formatWhole(tmp.e.effect[3]) + " extra INT, as well as generating +" + format(tmp.e.effect[4]) + "% of potential stimulations per second"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "After you evolve the first time, you can always bulk growth<br>and the effect of <b>Growth enhancement I</b> is changed";
			if (player.e.points.gte(5)) text += "<br><br>After you evolve six times, the last evolution effect is multiplied by 8";
			return text;
		}],
		"blank",
		"challenges",
	],
	layerShown() {return hasMilestone("g", 15) || player.e.unlocked},
	hotkeys: [{
		key: "e",
		description: "E: reset for evolutions",
		onPress() {if (player.e.unlocked) doReset("e")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("e", keep);
	},
	update(diff) {
		if (hasMilestone("g", 24) && player.e.challengesUnlocked < 1) player.e.challengesUnlocked = 1;
	},
	componentStyles: {
		"challenge"() {return {'width': '250px', 'height': '360px', 'border-radius': '25px'}},
	},
	challenges: {
		11: {
			name: "1st Retrogression",
			fullDisplay() {return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy INT.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: You always have all stimulation upgrades unlocked, you keep the first fifteen stimulation upgrades on growth resets, and the effects of <b>Growth enhancement I</b>, <b>Evolution enhancement III</b>, and INT are changed."},
			goal: 290,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return player.e.challengesUnlocked >= 1},
			doReset: true,
		},
		12: {
			name: "2nd Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq)) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy STR, WIS, or AGI.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The costs of STR, WIS, AGI, and INT are reduced by one level, the extra INT from evolutions is multiplied by 4, and you keep the first sixteen enhancements on evolve resets.";
				return "You need 8 evolutions to unlock this retrogression.";
			},
			goal: 215,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return player.e.challengesUnlocked >= 1},
			unlockReq: 8,
			enterable() {return player.e.points.gte(this.unlockReq)},
			doReset: true,
		},
	},
});
