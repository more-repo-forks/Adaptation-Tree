addLayer("s", {
	name: "Stimulation",
	symbol: "S",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#71EBB0",
	resource: "stimulations",
	row: 0,
	baseResource: modInfo.pointsName,
	baseAmount() {return player.points},
	requires: new Decimal(0.75),
	type: "normal",
	exponent: 0.5,
	softcap: new Decimal("1e50000"),
	softcapPower: 0.9,
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
		if (hasUpgrade("s", 82)) mult = mult.mul(upgradeEffect("s", 82));
		if (player.g.unlocked) mult = mult.mul(buyableEffect("g", 12));
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
		if (hasUpgrade("s", 83)) exp = exp.add(upgradeEffect("s", 83));
		if (hasChallenge("e", 11)) exp = exp.add(buyableEffect("g", 14));
		let eff = player.s.points.add(1).pow(exp);
		if (eff.gt("e875000")) eff = eff.div("e875000").pow(0.9).mul("e875000");
		return eff;
	},
	effectDescription() {
		let text = "which are multiplying power gain by " + format(tmp.s.effect) + "x";
		if (tmp.s.resetGain.gte(tmp.s.softcap)) text += "<br>(stimulation gain softcapped at " + formatWhole(tmp.s.softcap) + ")";
		if (tmp.s.effect.gt("e875000")) text += "<br>(stimulation effect softcapped at 1e875,000)";
		return text;
	},
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
		if (layers[resettingLayer].row == 2 && player.e.points.gte(20)) keep.push("upgrades");
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
			unlocked() {return !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 11) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 12) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 13) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 14) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 15) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 21) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 22) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 23) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 24) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 25) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 31) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 32) || player.g.unlocked) && !inChallenge("e", 13)},
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
			unlocked() {return (hasUpgrade("s", 33) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		35: {
			title: "Growth",
			description() {
				let text = "multiply power gain by 5 and unlock a new layer";
				if (player.g.unlocked) text += " (already unlocked)";
				return text;
			},
			effect() {return 5},
			cost() {
				let cost = new Decimal(25000000);
				if (!hasMilestone("g", 3) && !hasChallenge("e", 11)) cost = cost.div(buyableEffect("g", 14));
				return cost.floor();
			},
			unlocked() {return (hasUpgrade("s", 34) || player.g.unlocked) && !inChallenge("e", 13)},
		},
		41: {
			title: "Calmness",
			description: "multiply stimulation gain based on stimulations",
			effect() {return player.s.points.add(1).log10().mul(0.5).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e15),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(1)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		42: {
			title: "Consumption",
			description: "multiply power gain based on power",
			effect() {return player.points.add(1).log10().mul(0.75).add(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(2.5e16),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(2)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
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
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(3)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
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
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(4)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		45: {
			title: "Assimilation",
			description: "multiply power and stimulation gain by 10",
			effect() {return 10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e22),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(5)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		51: {
			title: "Swiftness",
			description: "divide growth requirement by 16",
			effect() {return 16},
			cost: new Decimal(2.5e20),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(6)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		52: {
			title: "Deregulation",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(5e21),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(7)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		53: {
			title: "Acceleration",
			description: "divide growth requirement based on your power",
			effect() {
				if (hasUpgrade("s", 62)) return player.points.mul(1e10).add(1).pow(0.05);
				else return player.points.add(1).log10().mul(0.5).add(1);
			},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(2.5e23),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(8)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		54: {
			title: "Freedom",
			description: "increase stimulation effect exponent by 0.1",
			effect() {return 0.1},
			cost: new Decimal(2.5e25),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(9)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		55: {
			title: "Boundlessness",
			description: "increase stimulation effect exponent based on your growth points",
			effect() {
				let eff = new Decimal(0);
				if (hasUpgrade("s", 61)) eff = player.g.points.add(1).pow(0.1).div(10);
				else eff = player.g.points.add(1).log10().mul(0.036);
				if (eff.gte(0.5)) return new Decimal(0.5);
				else return eff;
			},
			effectDisplay() {return "+" + format(this.effect()) + (this.effect().eq(0.5) ? " (max)" : "")},
			cost: new Decimal(2.5e28),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(10)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		61: {
			title: "Limitlessness",
			description: "improve the effect formula of <b>Boundlessness</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e50),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(11)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		62: {
			title: "Windlessness",
			description: "improve the effect formula of <b>Acceleration</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e60),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(12)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		63: {
			title: "Enlightenment",
			description: "improve the effect formula of <b>Meditation</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e71),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(13)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		64: {
			title: "Gorging",
			description: "improve the effect formula of <b>Absorbtion</b>",
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e84),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(14)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		65: {
			title: "Integration",
			description: "apply the effects of <b>Assimilation</b> two more times",
			effect() {return upgradeEffect("s", 45) ** 2},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal(1e100),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(15)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		71: {
			title: "Loosening",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e190),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(16)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		72: {
			title: "Passing",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e215),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(17)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		73: {
			title: "Breaking",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e245),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(18)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		74: {
			title: "Exceeding",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal(1e295),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(19)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		75: {
			title: "Break the Limit",
			description: "increase stimulation effect exponent by 0.05",
			effect() {return 0.05},
			cost: new Decimal("1e345"),
			unlocked() {return ((hasMilestone("g", 3) && buyableEffect("g", 14).gte(20)) || hasChallenge("e", 11)) && !inChallenge("e", 13)},
		},
		81: {
			title: "Warrior Blood",
			description: "multiply power gain by 1e25",
			effect() {return 1e25},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e2500"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		82: {
			title: "Scholar Blood",
			description: "multiply stimulation gain by 1e10",
			effect() {return 1e10},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e3500"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		83: {
			title: "Wanderer Blood",
			description: "increase stimulation effect exponent by 0.0025",
			effect() {return 0.0025},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e4575"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		84: {
			title: "Alchemist Blood",
			description: "decrease base growth requirement by 0.1125",
			effect() {return 0.1125},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e6220"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
		},
		85: {
			title: "Mutant Blood",
			description: "divide evolution requirement by 1.25",
			effect() {return 1.25},
			currencyDisplayName: modInfo.pointsName,
			currencyInternalName: "points",
			cost: new Decimal("1e7800"),
			unlocked() {return hasChallenge("e", 13) && !inChallenge("e", 13)},
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
		autoSTR: false,
		autoWIS: false,
		autoAGI: false,
		autoINT: false,
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
		if (hasUpgrade("s", 84)) base -= upgradeEffect("s", 84);
		if (hasMilestone("g", 18)) base -= milestoneEffect("g", 18);
		if (hasMilestone("g", 25)) base -= milestoneEffect("g", 25);
		if (hasMilestone("g", 31)) base -= milestoneEffect("g", 31);
		if (hasMilestone("g", 36)) base -= milestoneEffect("g", 36);
		if (hasMilestone("g", 38)) base -= milestoneEffect("g", 38);
		if (hasMilestone("g", 44)) base -= milestoneEffect("g", 44);
		if (hasMilestone("g", 49)) base -= milestoneEffect("g", 49);
		if (hasMilestone("g", 53)) base -= milestoneEffect("g", 53);
		if (hasMilestone("g", 59)) base -= milestoneEffect("g", 59);
		return base;
	},
	exponent: 1,
	canBuyMax() {return hasMilestone("g", 8) || player.e.unlocked},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("s", 51)) mult = mult.div(upgradeEffect("s", 51));
		if (hasUpgrade("s", 53)) mult = mult.div(upgradeEffect("s", 53));
		if (player.g.unlocked) mult = mult.div(buyableEffect("g", 13));
		if (hasChallenge("e", 13) && tmp.e.effect[5]) mult = mult.div(tmp.e.effect[5]);
		if (tmp.a.effect[0]) mult = mult.div(tmp.a.effect[0]);
		return mult;
	},
	resetsNothing() {return hasMilestone("g", 36)},
	autoPrestige() {return hasMilestone("g", 36) && player.e.points.gte(60) && player.sp.unlocked},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	tabFormat() {
		// top text
		let topText = "<div style='height: 25px; padding-top: ";
		if (player.e.points.gte(30) || player.sp.unlocked) {
			topText += "20px'>";
		} else {
			topText += "5px'>";
		};
		if (getClickableState("g", 14)) {
			topText += "Only extra levels";
		} else if (getClickableState("g", 11)) {
			if (getClickableState("g", 13)) topText += "Only base levels " + formatWhole((+getClickableState("g", 11)) * 50) + "+";
			else topText += "Only levels " + formatWhole((+getClickableState("g", 11)) * 50) + "+";
		} else {
			if (getClickableState("g", 13)) topText += "Only base levels";
			else topText += "All levels";
		};
		// stat svg display
		const reduction = (+getClickableState("g", 11)) * 50;
		let max = 1;
		if (getClickableState("g", 13)) {
			max += getBuyableAmount("g", 11).max(getBuyableAmount("g", 12)).max(getBuyableAmount("g", 13)).max(getBuyableAmount("g", 14)).toNumber() - reduction;
		} else if (getClickableState("g", 14)) {
			max += tmp.g.buyables[11].extra.max(tmp.g.buyables[12].extra).max(tmp.g.buyables[13].extra).max(tmp.g.buyables[14].extra).toNumber();
		} else {
			max += getBuyableAmount("g", 11).add(tmp.g.buyables[11].extra).max(getBuyableAmount("g", 12).add(tmp.g.buyables[12].extra)).max(getBuyableAmount("g", 13).add(tmp.g.buyables[13].extra)).max(getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra)).toNumber() - reduction;
		};
		if (max < 2) max = 2;
		let statText = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
		statText += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
		statText += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
		let rectMax = max;
		if (rectMax >= 16) {
			rectMax = max / (2 ** Math.floor(Math.log2(max) - 3));
		};
		for (let index = 0; index < rectMax; index++) {
			let low = Math.min((index / rectMax * 45) + 5.5, 50);
			let high = Math.max(((rectMax - index) / rectMax * 90) - 1, 0);
			statText += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
		};
		// normal stats
		let stats = (getClickableState("g", 14) ? [1, 1, 1, 1] : [
			getBuyableAmount("g", 11).toNumber() - reduction + 1,
			getBuyableAmount("g", 13).toNumber() - reduction + 1,
			getBuyableAmount("g", 14).toNumber() - reduction + 1,
			getBuyableAmount("g", 12).toNumber() - reduction + 1,
		]);
		let statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
		let statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
		if (!getClickableState("g", 14)) statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
		// extra stats
		if (!getClickableState("g", 13)) {
			stats[0] += tmp.g.buyables[11].extra.toNumber();
			stats[1] += tmp.g.buyables[13].extra.toNumber();
			stats[2] += tmp.g.buyables[14].extra.toNumber();
			stats[3] += tmp.g.buyables[12].extra.toNumber();
			statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
			statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
		};
		statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
		// buyable columns
		let cols = [];
		cols[1] = [
			["display-text", topText + "</div>"],
			["display-text", statText + "</svg>"],
			["row", [
				["clickable", 11],
				["clickable", 12],
				["blank", ["10px", "30px"]],
				["clickable", 13],
				["clickable", 14],
			]],
		];
		if (player.e.points.gte(30) || player.sp.unlocked) {
			cols[0] = [["buyable", 11], ["blank", "10px"], ["toggle", ["g", "autoSTR"]], ["blank", "25px"], ["buyable", 12], ["blank", "10px"], ["toggle", ["g", "autoWIS"]]];
			cols[2] = [["buyable", 13], ["blank", "10px"], ["toggle", ["g", "autoAGI"]], ["blank", "25px"], ["buyable", 14], ["blank", "10px"], ["toggle", ["g", "autoINT"]]];
			cols[1].push(["blank", "15px"], "respec-button");
		} else {
			cols[0] = [["buyable", 11], ["blank", "75px"], ["buyable", 12]];
			cols[2] = [["buyable", 13], ["blank", "75px"], ["buyable", 14]];
		};
		// return
		return [
			"main-display",
			"prestige-button",
			"resource-display",
			["row", [
				["column", cols[0]], ["column", cols[1]], ["column", cols[2]],
			]],
			(player.e.points.gte(30) || player.sp.unlocked ? undefined : "respec-button"),
			"blank",
			"milestones",
		];
	},
	layerShown() {return hasUpgrade("s", 35) || player.g.unlocked},
	hotkeys: [{
		key: "g",
		description: "G: reset for growth points",
		onPress() {if (player.g.unlocked) doReset("g")},
	}],
	doReset(resettingLayer) {
		let keep = ["autoSTR", "autoWIS", "autoAGI", "autoINT"];
		if (layers[resettingLayer].row > this.row) {
			let keepMileNum = 0; keepMile = [];
			if (resettingLayer == "e" && hasChallenge("e", 12)) keepMileNum = 16;
			if (layers[resettingLayer].row == 2 && player.e.points.gte(36)) keepMileNum = 41;
			if (keepMileNum > 0) {
				for (let index = 0; index < player.g.milestones.length; index++) {
					if (player.g.milestones[index] < keepMileNum) keepMile.push(player.g.milestones[index]);
				};
			};
			layerDataReset("g", keep);
			if (!keep.includes("milestones")) {
				player.g.milestones = keepMile;
			};
		};
	},
	automate() {
		if (player.e.points.gte(30) || player.sp.unlocked) {
			if (player.g.autoSTR && layers.g.buyables[11].canAfford()) layers.g.buyables[11].buy();
			if (player.g.autoWIS && layers.g.buyables[12].canAfford()) layers.g.buyables[12].buy();
			if (player.g.autoAGI && layers.g.buyables[13].canAfford()) layers.g.buyables[13].buy();
			if (player.g.autoINT && layers.g.buyables[14].canAfford()) layers.g.buyables[14].buy();
		};
	},
	componentStyles: {
		"buyable"() {return {'width': '210px', 'height': '110px'}},
		"clickable"() {return {'min-height': '30px', 'transform': 'none'}},
	},
	buyables: {
		11: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100);
				return amt.add(1).max(0);
			},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				if (hasMilestone("g", 6)) base = base.mul(milestoneEffect("g", 6));
				if (hasMilestone("g", 11)) base = base.mul(milestoneEffect("g", 11));
				if (hasMilestone("g", 14)) base = base.mul(milestoneEffect("g", 14));
				if (hasMilestone("g", 21)) base = base.mul(milestoneEffect("g", 21));
				if (hasMilestone("g", 27)) base = base.mul(milestoneEffect("g", 27));
				if (hasMilestone("g", 34)) base = base.mul(milestoneEffect("g", 34));
				if (hasMilestone("g", 43)) base = base.mul(milestoneEffect("g", 43));
				if (hasMilestone("g", 54)) base = base.mul(milestoneEffect("g", 54));
				if (hasMilestone("g", 61)) base = base.mul(milestoneEffect("g", 61));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(STR)ENGTH",
			display() {return "multiply power gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 54)) max += 90;
				if (hasMilestone("g", 61)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("g", 63)) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[0]) extra = extra.add(tmp.e.effect[0]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				return extra;
			},
		},
		12: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100);
				return amt.add(1).max(0);
			},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("g", 0)) base = base.mul(milestoneEffect("g", 0));
				if (hasMilestone("g", 2)) base = base.mul(milestoneEffect("g", 2));
				if (hasMilestone("g", 10)) base = base.mul(milestoneEffect("g", 10));
				if (hasMilestone("g", 17)) base = base.mul(milestoneEffect("g", 17));
				if (hasMilestone("g", 20)) base = base.mul(milestoneEffect("g", 20));
				if (hasMilestone("g", 28)) base = base.mul(milestoneEffect("g", 28));
				if (hasMilestone("g", 33)) base = base.mul(milestoneEffect("g", 33));
				if (hasMilestone("g", 42)) base = base.mul(milestoneEffect("g", 42));
				if (hasMilestone("g", 56)) base = base.mul(milestoneEffect("g", 56));
				if (hasMilestone("g", 62)) base = base.mul(milestoneEffect("g", 62));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(WIS)DOM",
			display() {return "multiply stimulation gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 56)) max += 90;
				if (hasMilestone("g", 62)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("g", 63)) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[1]) extra = extra.add(tmp.e.effect[1]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				return extra;
			},
		},
		13: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100);
				return amt.add(1).max(0);
			},
			effectBase() {
				if (hasMilestone("g", 46)) {
					let base = new Decimal(milestoneEffect("g", 46));
					if (hasMilestone("g", 51)) base = base.mul(milestoneEffect("g", 51));
					if (hasMilestone("g", 58)) base = base.mul(milestoneEffect("g", 58));
					if (hasMilestone("g", 65)) base = base.mul(milestoneEffect("g", 65));
					return base;
				};
				let base = new Decimal(4);
				if (hasMilestone("g", 4)) base = base.add(milestoneEffect("g", 4));
				if (hasMilestone("g", 5)) base = base.add(milestoneEffect("g", 5));
				if (hasMilestone("g", 9)) base = base.add(milestoneEffect("g", 9));
				if (hasMilestone("g", 16)) base = base.add(milestoneEffect("g", 16));
				if (hasMilestone("g", 22)) base = base.add(milestoneEffect("g", 22));
				if (hasMilestone("g", 30)) base = base.add(milestoneEffect("g", 30));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(AGI)LITY",
			display() {
				if (hasMilestone("g", 46)) return "divide growth point<br>requirement by " + formatWhole(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				else return "divide growth requirement by " + formatWhole(this.effectBase()) + "<br>(min requirement: 100,000,000)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 46)) max += 840;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (tmp.e.effect[2]) extra = extra.add(tmp.e.effect[2]);
				if (hasMilestone("g", 37)) extra = extra.add(milestoneEffect("g", 37));
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				return extra;
			},
		},
		14: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				if (amt.gte(100)) return new Decimal(1.5).pow(amt.sub(99).pow(0.5)).mul(100).floor();
				return amt.add(1).max(0);
			},
			maxEffect() {
				if (hasChallenge("e", 11)) {
					return 0.5;
				} else if (hasMilestone("g", 3)) {
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
				if (hasChallenge("e", 11)) {
					let eff = getBuyableAmount(this.layer, this.id).add(this.extra()).pow(0.75).mul(this.effectBase());
					if (eff.gt(0.375)) eff = eff.sub(0.375).div(2.5).add(0.375);
					return eff.min(this.maxEffect());
				} else if (hasMilestone("g", 3)) return getBuyableAmount(this.layer, this.id).add(this.extra()).mul(this.effectBase()).min(this.maxEffect());
				else return new Decimal(5).pow(getBuyableAmount(this.layer, this.id).add(this.extra()));
			},
			title: "(INT)ELLECT",
			display() {
				if (hasChallenge("e", 11)) {
					if (this.effect().eq(this.maxEffect())) return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br><br>Effect: +" + format(this.effect()) + " (max)<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else if (this.effect().gt(0.375)) return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br>(effect is softcapped at 0.375)<br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br>(effective INT is powered to 0.75)<br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				if (hasMilestone("g", 3)) {
					let base = this.effectBase();
					if (base.eq(1)) return "unlock a new stimulation upgrade<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else return "unlock " + format(base) + " new stimulation upgrades<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				return "divide previous upgrade costs by 5<br>(upgrade costs are rounded down)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 57)) max += 40;
				if (hasMilestone("g", 63)) max += 800;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 11) && !inChallenge("e", 16)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("g", 35)) extra = extra.add(milestoneEffect("g", 35));
				if (hasMilestone("g", 41)) extra = extra.add(milestoneEffect("g", 41));
				if (hasMilestone("g", 63)) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[3]) extra = extra.add(tmp.e.effect[3]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				return extra;
			},
		},
		respec() {
			if (getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) {
				setBuyableAmount("g", 11, new Decimal(100));
				setBuyableAmount("g", 12, new Decimal(100));
				setBuyableAmount("g", 13, new Decimal(100));
				setBuyableAmount("g", 14, new Decimal(100));
				if (hasChallenge("e", 12)) player.g.spent = new Decimal(19800);
				else player.g.spent = new Decimal(20200);
				if (getClickableState("g", 11) > 2) setClickableState("g", 11, 2);
			} else {
				setBuyableAmount("g", 11, new Decimal(0));
				setBuyableAmount("g", 12, new Decimal(0));
				setBuyableAmount("g", 13, new Decimal(0));
				setBuyableAmount("g", 14, new Decimal(0));
				player.g.spent = new Decimal(0);
				setClickableState("g", 11, 0);
			};
			doReset("g", true, true);
		},
		respecText: "respec growth points",
	},
	clickables: {
		11: {
			display() {return "<h2>-50</h2>"},
			canClick() {return getClickableState("g", 11) > 0 && !getClickableState("g", 14)},
			onClick() {setClickableState("g", 11, (+getClickableState("g", 11)) - 1)},
			style: {"width": "45px", "border-radius": "10px 0 0 10px"},
		},
		12: {
			display() {return "<h2>+50</h2>"},
			canClick() {
				let amt = new Decimal(((+getClickableState("g", 11)) + 1) * 50);
				return getBuyableAmount("g", 11).gte(amt) && getBuyableAmount("g", 12).gte(amt) && getBuyableAmount("g", 13).gte(amt) && getBuyableAmount("g", 14).gte(amt) && !getClickableState("g", 14);
			},
			onClick() {setClickableState("g", 11, (+getClickableState("g", 11)) + 1)},
			style: {"width": "45px", "border-radius": "0 10px 10px 0"},
		},
		13: {
			display() {return (getClickableState("g", 13) ? "Both" : "Only Base")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 13, !getClickableState("g", 13));
				if (getClickableState("g", 13)) setClickableState("g", 14, false);
			},
			style: {"width": "40px", "border-radius": "10px 0 0 10px"},
		},
		14: {
			display() {return (getClickableState("g", 14) ? "Both" : "Only Extra")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 14, !getClickableState("g", 14));
				if (getClickableState("g", 14)) setClickableState("g", 13, false);
			},
			style: {"width": "40px", "border-radius": "0 10px 10px 0"},
		},
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
			effectDescription() {
				let text = "unlock a new layer";
				if (player.e.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
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
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		17: {
			requirement: 420,
			requirementDescription: "WIS enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		18: {
			requirement: 488,
			requirementDescription: "Growth enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease base growth requirement by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		19: {
			requirement: 525,
			requirementDescription: "Evolution enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5},
			effectDescription() {return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		20: {
			requirement: 575,
			requirementDescription: "WIS enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.15).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		21: {
			requirement: 640,
			requirementDescription: "STR enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		22: {
			requirement: 715,
			requirementDescription: "AGI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 32},
			effectDescription() {return "increase the base effect of AGI by 32<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
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
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
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
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		25: {
			requirement: 2000,
			requirementDescription: "Growth enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.07},
			effectDescription() {return "decrease base growth requirement by 0.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		26: {
			requirement: 2666,
			requirementDescription: "INT enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.003},
			effectDescription() {return "increase the base effect of INT by 0.003<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		27: {
			requirement: 3725,
			requirementDescription: "STR enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		28: {
			requirement: 4050,
			requirementDescription: "WIS enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.055)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		29: {
			requirement: 4960,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.425},
			effectDescription() {return "divide evolution requirement by 1.425<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		30: {
			requirement: 10000,
			requirementDescription: "AGI enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 935},
			effectDescription() {return "increase the base effect of AGI by 935<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		31: {
			requirement: 25300,
			requirementDescription: "Growth enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		32: {
			requirement: 26400,
			requirementDescription: "Evolution enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.25},
			effectDescription() {return "divide evolution requirement by 1.25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		33: {
			requirement: 29450,
			requirementDescription: "WIS enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.066)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		34: {
			requirement: 32000,
			requirementDescription: "STR enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		35: {
			requirement: 34550,
			requirementDescription: "INT enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		36: {
			requirement: 47175,
			requirementDescription: "Growth enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "growth resets (without respec) no longer reset anything<br>and decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		37: {
			requirement: 50950,
			requirementDescription: "AGI enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 50},
			effectDescription() {return "increase extra AGI levels by 50<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		38: {
			requirement: 53333,
			requirementDescription: "Growth enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		39: {
			requirement: 55155,
			requirementDescription: "Evolution enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.07},
			effectDescription() {return "divide evolution requirement by 1.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		40: {
			requirement: 64750,
			requirementDescription: "Acclimation enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.a.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		41: {
			requirement: 77555,
			requirementDescription: "INT enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		42: {
			requirement: 85555,
			requirementDescription: "WIS enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.03)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		43: {
			requirement: 164000,
			requirementDescription: "STR enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.11)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		44: {
			requirement: 190000,
			requirementDescription: "Growth enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.005},
			effectDescription() {return "decrease base growth requirement by 0.005<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		45: {
			requirement: 236250,
			requirementDescription: "Evolution enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5666},
			effectDescription() {return "divide evolution requirement by 1.5666<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		46: {
			requirement: 238000,
			requirementDescription: "AGI enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e10},
			effectDescription() {return "increase the base effect of AGI to 1e10<br>and increase its maximum by 840<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		47: {
			requirement: 254300,
			requirementDescription: "Evolution enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.487},
			effectDescription() {return "divide evolution requirement by 1.487<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		48: {
			requirement: 256000,
			requirementDescription: "Acclimation enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		49: {
			requirement: 258425,
			requirementDescription: "Growth enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.1858},
			effectDescription() {return "decrease base growth requirement by 0.1858<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		50: {
			requirement: 349333,
			requirementDescription: "Evolution enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05732},
			effectDescription() {return "decrease base evolution requirement by 0.05732<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		51: {
			requirement: 352750,
			requirementDescription: "AGI enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e15},
			effectDescription() {return "multiply the base effect of AGI by 1e15<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		52: {
			requirement: 400450,
			requirementDescription: "Acclimation enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		53: {
			requirement: 419625,
			requirementDescription: "Growth enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease base growth requirement by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		54: {
			requirement: 467850,
			requirementDescription: "STR enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e20).add(1).pow(0.555)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		55: {
			requirement: 664750,
			requirementDescription: "Evolution enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.045875},
			effectDescription() {return "decrease base evolution requirement by 0.045875<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		56: {
			requirement: 842525,
			requirementDescription: "WIS enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e10).add(1).pow(0.459)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		57: {
			requirement: 1957700,
			requirementDescription: "INT enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "increase the maximum of INT by 40<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		58: {
			requirement: 2459000,
			requirementDescription: "AGI enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e25},
			effectDescription() {return "multiply the base effect of AGI by 1e25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		59: {
			requirement: 2769360,
			requirementDescription: "Growth enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.12},
			effectDescription() {return "decrease base growth requirement by 0.12<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		60: {
			requirement: 8658450,
			requirementDescription: "Acclimation enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.222},
			effectDescription() {return "divide acclimation requirement by 1.222<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		61: {
			requirement: 14606750,
			requirementDescription: "STR enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(2e20).add(1).pow(2.5)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		62: {
			requirement: 20968222,
			requirementDescription: "WIS enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1.5177e20).add(1).pow(17.77)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		63: {
			requirement: 68729900,
			requirementDescription: "INT enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra).sub(248).div(2).floor()},
			effectDescription() {return "every 2 INT past 248 gives 1 extra STR, WIS, and INT<br>and increase the maximum of INT by 800<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		64: {
			requirement: 102912250,
			requirementDescription: "Evolution enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.04762644},
			effectDescription() {return "decrease base evolution requirement by 0.04762644<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		65: {
			requirement: 122206000,
			requirementDescription: "AGI enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal("1e7000")},
			effectDescription() {return "multiply the base effect of AGI by 1e7000<br>Req: " + formatWhole(this.requirement) + " growth points"},
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
		challengesUnlocked: false,
	}},
	color: "#ED6A5E",
	resource: "evolutions",
	row: 2,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(300),
	type: "static",
	base() {
		let base = 1.5;
		if (hasMilestone("g", 50)) base -= milestoneEffect("g", 50);
		if (hasMilestone("g", 55)) base -= milestoneEffect("g", 55);
		if (hasMilestone("g", 64)) base -= milestoneEffect("g", 64);
		if (hasChallenge("e", 16)) base -= 0.052545;
		return base;
	},
	exponent: 1,
	canBuyMax() {return player.sp.unlocked},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("s", 85)) mult = mult.div(upgradeEffect("s", 85));
		if (hasMilestone("g", 19)) mult = mult.div(milestoneEffect("g", 19));
		if (hasMilestone("g", 24) && hasChallenge("e", 11)) mult = mult.div(milestoneEffect("g", 24));
		if (hasMilestone("g", 29)) mult = mult.div(milestoneEffect("g", 29));
		if (hasMilestone("g", 32)) mult = mult.div(milestoneEffect("g", 32));
		if (hasMilestone("g", 39)) mult = mult.div(milestoneEffect("g", 39));
		if (hasMilestone("g", 45)) mult = mult.div(milestoneEffect("g", 45));
		if (hasMilestone("g", 47)) mult = mult.div(milestoneEffect("g", 47));
		if (tmp.a.effect[1]) mult = mult.div(tmp.a.effect[1]);
		if (tmp.sp.effect[0]) mult = mult.div(tmp.sp.effect[0]);
		return mult;
	},
	effect() {
		let mult = [new Decimal(1), new Decimal(1), new Decimal(2), new Decimal(0.5), new Decimal(0.25), new Decimal(1)];
		if (player.e.points.gte(6)) mult[4] = mult[4].mul(32);
		if (player.e.points.gte(14)) mult[4] = mult[4].mul(500);
		if (player.e.points.gte(26)) mult[5] = mult[5].mul(10000);
		if (player.e.points.gte(36)) mult[5] = mult[5].mul("1e1541");
		if (player.e.points.gte(68)) mult[5] = mult[5].mul("1e19550");
		if (hasChallenge("e", 12)) mult[3] = mult[3].mul(4);
		if (hasChallenge("e", 13)) mult[2] = mult[2].mul(2);
		if (hasChallenge("e", 14)) mult[1] = mult[1].mul(1.6);
		if (hasChallenge("e", 15)) {
			mult[0] = mult[0].mul(1.6);
			mult[5] = mult[5].mul(10000);
		};
		if (hasChallenge("e", 16)) {
			mult[0] = mult[0].mul(1.25);
			mult[1] = mult[1].mul(1.25);
			mult[2] = mult[2].mul(1.25);
			mult[3] = mult[3].mul(1.25);
		};
		if (tmp.sp.effect[1]) {
			mult[0] = mult[0].mul(tmp.sp.effect[1]);
			mult[1] = mult[1].mul(tmp.sp.effect[1]);
			mult[2] = mult[2].mul(tmp.sp.effect[1]);
			mult[3] = mult[3].mul(tmp.sp.effect[1]);
		};
		let pow5 = new Decimal(1);
		if (tmp.sp.effect[2]) pow5 = pow5.mul(tmp.sp.effect[2]);
		return [
			player.e.points.mul(mult[0]).floor(),
			player.e.points.mul(mult[1]).floor(),
			player.e.points.mul(mult[2]).floor(),
			player.e.points.mul(mult[3]).floor(),
			player.e.points.mul(mult[4]).min(1e300),
			new Decimal(10).mul(mult[5]).pow(player.e.points.pow(pow5)),
		];
	},
	effectDescription() {
		let text = "which are giving " + formatWhole(tmp.e.effect[0]) + " extra STR, " + formatWhole(tmp.e.effect[1]) + " extra WIS, " + formatWhole(tmp.e.effect[2]) + " extra AGI, and " + formatWhole(tmp.e.effect[3]) + " extra INT, as well as generating +" + format(tmp.e.effect[4]) + "% of potential stimulations per second";
		if (hasChallenge("e", 13)) text += " and dividing growth requirement by /" + format(tmp.e.effect[5]);
		return text;
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			const effects = {
				1: () => {
					if (player.sp.unlocked) return;
					else return "You can always bulk growth.<br>The effect of <b>Growth enhancement I</b> is changed."
				},
				6: () => {
					if (player.e.points.gte(14)) return;
					else if (hasChallenge("e", 13)) return "The second to last evolution effect is multiplied by 32.";
					else return "The last evolution effect is multiplied by 32.";
				},
				14: () => {
					if (hasChallenge("e", 13)) {
						if (player.e.points.gte(14)) return "The second to last evolution effect is multiplied by 16,000.";
						else return "The second to last evolution effect is multiplied by 500.";
					} else {
						if (player.e.points.gte(14)) return "The last evolution effect is multiplied by 16,000.";
						else return "The last evolution effect is multiplied by 500.";
					};
				},
				20: "You keep all stimulation upgrades on row 3 resets.",
				26() {
					if (player.e.points.gte(36)) return "The acclimation requirement is divided by 1.0915.";
					else return "The acclimation requirement is divided by 1.0915.<br>The base of the last evolution effect is multiplied by 10,000.";
				},
				30() {
					if (player.sp.unlocked) return;
					else return "More automation for growth is unlocked.";
				},
				36() {
					if (player.e.points.gte(68)) return "You keep the first fourty-one growth enhancements on row 3 resets.";
					if (player.e.points.gte(36)) return "The base of the last evolution effect is multiplied by 1e1545.<br>You keep the first fourty-one growth enhancements on row 3 resets.";
					else return "The base of the last evolution effect is multiplied by 1e1541.<br>You keep the first fourty-one growth enhancements on row 3 resets.";
				},
				60() {
					if (player.sp.unlocked) return "Potential growth points are automatically claimed.";
					else return "A new layer is unlocked.";
				},
				68() {
					if (player.e.points.gte(68)) return "The base of the last evolution effect is multiplied by 1e21,095.";
					else return "The base of the last evolution effect is multiplied by 1e19,550.";
				},
			};
			let text = "";
			for (const key in effects) {
				if (Object.hasOwnProperty.call(effects, key) && (typeof effects[+key] == "function" ? effects[+key]() : effects[+key])) {
					if (player.e.points.gte(+key)) {
						if (+key === 26 && !hasChallenge("e", 13)) {
							text += "<br><br>You need to complete the 3rd retrogression to obtain the next effect.";
							break;
						} else {
							if (!text.startsWith("Extra effect(s):")) text += "Extra effect(s):";
							text += "<br>" + (typeof effects[+key] == "function" ? effects[+key]() : effects[+key]);
						};
					} else {
						if (text) text += "<br><br>";
						if (+key === 1) text += "After you evolve 1 time";
						else text += "After you evolve " + formatWhole(key) + " times";
						text += ", you will obtain the following effect(s):<br>" + (typeof effects[+key] == "function" ? effects[+key]() : effects[+key]);
						break;
					};
				};
			};
			return text;
		}],
		"blank",
		"challenges",
		"blank",
	],
	layerShown() {return hasMilestone("g", 15) || player.e.unlocked},
	hotkeys: [{
		key: "e",
		description: "E: reset for evolutions",
		onPress() {if (player.e.unlocked) doReset("e")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (resettingLayer == "sp") keep.push("challenges");
		if (layers[resettingLayer].row > this.row) layerDataReset("e", keep);
	},
	update(diff) {
		if (hasMilestone("g", 24) && !player.e.challengesUnlocked) player.e.challengesUnlocked = true;
	},
	componentStyles: {
		"challenge"() {return {'width': '250px', 'height': '360px', 'border-radius': '50px'}},
	},
	challenges: {
		11: {
			name: "1st Retrogression",
			fullDisplay() {return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy INT.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: You always have all stimulation upgrades unlocked, you keep the first fifteen stimulation upgrades on growth resets, and the effects of <b>Growth enhancement I</b>, <b>Evolution enhancement III</b>, and INT are changed."},
			goal: 290,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return player.e.challengesUnlocked || player.sp.unlocked},
			doReset: true,
		},
		12: {
			name: "2nd Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || player.sp.unlocked) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy STR, WIS, or AGI.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The costs of STR, WIS, AGI, and INT are reduced by one level, the extra INT from evolutions is multiplied by 4, and you keep the first sixteen growth enhancements on evolve resets.";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 215,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1)},
			unlockReq: 8,
			enterable() {return player.e.points.gte(this.unlockReq) || player.sp.unlocked},
			doReset: true,
		},
		13: {
			name: "3rd Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || player.sp.unlocked) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy stimulation upgrades.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The extra AGI from evolutions is multiplied by 2, unlock 5 more stimulation upgrades, and unlock a new evolution effect";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 345,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1)},
			unlockReq: 11,
			enterable() {return player.e.points.gte(this.unlockReq) || player.sp.unlocked},
			doReset: true,
		},
		14: {
			name: "4th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || player.sp.unlocked) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, your power gain will not increase.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The extra WIS from evolutions is multiplied by 1.6 and if STR, WIS, AGI, and INT are all level 100 not counting extra levels, the maximum levels of STR, WIS, AGI, and INT will increase by 60 but their costs will increase much faster";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 650,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1)},
			unlockReq: 14,
			enterable() {return player.e.points.gte(this.unlockReq) || player.sp.unlocked},
			doReset: true,
		},
		15: {
			name: "5th Retrogression",
			fullDisplay() {
				if (player.e.points.gte(this.unlockReq) || player.sp.unlocked) return "Entering this retrogression does an evolution reset.<br>While in this retrogression, all previous in retrogression effects are applied, but growth enhancements past 16 multiply power by 1e10 after that.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: The base of the last evolution effect is multiplied by 10,000 and the extra STR from evolutions is multiplied by 1.6";
				return "You need " + formatWhole(this.unlockReq) + " evolutions to unlock this retrogression.";
			},
			goal: 660,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1)},
			unlockReq: 18,
			enterable() {return player.e.points.gte(this.unlockReq) || player.sp.unlocked},
			doReset: true,
			countsAs: [11, 12, 13, 14],
		},
		16: {
			name: "6th Retrogression",
			fullDisplay() {return "Entering this retrogression does an evolution reset.<br>While in this retrogression, you cannot buy STR, WIS, AGI, or INT.<br><br>Goal: " + formatWhole(this.goal) + " growth points<br><br>Rewards: Decrease the base evolution requirement by 0.052545, the extra STR, WIS, AGI, and INT from evolutions is multiplied by 1.25, and divide acclimation requirement based on evolutions (currently /" + format(this.rewardEffect()) + ")"},
			rewardEffect() {return player.e.points.add(1).pow(0.439)},
			goal: 106907666,
			canComplete() {return player.g.points.gte(this.goal)},
			unlocked() {return hasMilestone("a", 12)},
			enterable() {return player.e.points.gte(this.unlockReq) || player.sp.unlocked},
			doReset: true,
		},
	},
});

addLayer("a", {
	name: "Acclimation",
	symbol: "A",
	position: 1,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
		population: new Decimal(1),
		populationMax: new Decimal(1),
		populationTime: 0,
	}},
	color: "#B3478F",
	resource: "acclimation points",
	row: 2,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(64000),
	type: "static",
	base: 2,
	exponent: 1,
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("g", 48)) mult = mult.div(milestoneEffect("g", 48));
		if (hasMilestone("g", 52)) mult = mult.div(milestoneEffect("g", 52));
		if (hasMilestone("g", 60)) mult = mult.div(milestoneEffect("g", 60));
		if (player.e.points.gte(26)) mult = mult.div(1.0915);
		if (hasChallenge("e", 16)) mult = mult.div(challengeEffect("e", 16));
		if (player.a.unlocked) mult = mult.div(buyableEffect("a", 13));
		return mult;
	},
	effect() {
		let amt = player.a.population;
		amt = amt.mul(buyableEffect("a", 14));
		let mult = [1, 1, 1];
		if (hasMilestone("a", 3)) mult[2] *= milestoneEffect("a", 3);
		if (hasMilestone("a", 11)) mult[1] *= milestoneEffect("a", 11);
		let eff = [
			(hasMilestone("a", 6) ? amt.add(1).pow(amt.log10().add(1).pow(0.125).mul(200000)) : new Decimal(10).pow(amt.sub(1)).sub(1).mul(1e100).add(1)),
			amt.pow(0.1).mul(mult[1]),
			amt.log10().mul(mult[2]).floor(),
		];
		if (!hasMilestone("a", 6)) {
			if (eff[0].gt("e750000")) eff[0] = eff[0].div("e750000").pow(0.1).mul("e750000");
			if (eff[0].gt("e1500000")) eff[0] = eff[0].div("e1500000").log10().pow(15000).mul("e1500000");
		};
		return eff;
	},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {return "Your population is currently <h2 style='color: #B3478F; text-shadow: #B3478F 0px 0px 10px'>" + formatWhole(player.a.population) + "</h2>, which is dividing growth requirement by /" + format(tmp.a.effect[0]) + ", dividing evolution requirement by /" + format(tmp.a.effect[1]) + ", and giving " + formatWhole(tmp.a.effect[2]) + " extra STR, WIS, AGI, and INT.<br>(" + formatWhole(player.a.populationMax) + " max population)"}],
		"blank",
		["row", [
			["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
			["display-text", () => {
				let max = getBuyableAmount("a", 11).add(tmp.a.buyables[11].extra).max(getBuyableAmount("a", 12).add(tmp.a.buyables[12].extra)).max(getBuyableAmount("a", 13).add(tmp.a.buyables[13].extra)).max(getBuyableAmount("a", 14).add(tmp.a.buyables[14].extra)).toNumber() + 1;
				if (max < 2) max = 2;
				let text = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
				text += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
				text += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
				let rectMax = max;
				if (rectMax >= 16) {
					rectMax = max / (2 ** Math.floor(Math.log2(max) - 3));
				};
				for (let index = 0; index < rectMax; index++) {
					let low = Math.min((index / rectMax * 45) + 5.5, 50);
					let high = Math.max(((rectMax - index) / rectMax * 90) - 1, 0);
					text += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
				};
				// normal stats
				let stats = [
					getBuyableAmount("a", 11).toNumber() + 1,
					getBuyableAmount("a", 13).toNumber() + 1,
					getBuyableAmount("a", 14).toNumber() + 1,
					getBuyableAmount("a", 12).toNumber() + 1,
				];
				let statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				let statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				// extra stats
				stats[0] += tmp.a.buyables[11].extra.toNumber();
				stats[1] += tmp.a.buyables[13].extra.toNumber();
				stats[2] += tmp.a.buyables[14].extra.toNumber();
				stats[3] += tmp.a.buyables[12].extra.toNumber();
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
	layerShown() {return hasMilestone("g", 40) || player.a.unlocked},
	hotkeys: [{
		key: "a",
		description: "A: reset for acclimation points",
		onPress() {if (player.a.unlocked) doReset("a")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("a", keep);
		player.a.populationTime = 0;
	},
	update(diff) {
		// add time
		player.a.populationTime += diff;
		// calculate maximum
		let max = new Decimal(1);
		max = max.mul(buyableEffect("a", 11));
		player.a.populationMax = max;
		// calculate rate
		let rate = new Decimal(player.a.populationTime).mul(2).div(max.pow(0.5));
		rate = rate.mul(buyableEffect("a", 12));
		// calculate population
		player.a.population = max.div(max.sub(1).mul(new Decimal(Math.E).pow(rate.neg())).add(1)).round();
	},
	componentStyles: {
		"buyable"() {return {'width': '210px', 'height': '110px'}},
	},
	buyables: {
		11: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(10);
				if (hasMilestone("a", 0)) base = base.mul(milestoneEffect("a", 0));
				if (hasMilestone("a", 13)) base = base.mul(milestoneEffect("a", 13));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(CRA)FTSMANSHIP",
			display() {return "multiply population maximum by " + format(this.effectBase()) + "<br>(population max also influences gain)<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 7)) extra = extra.add(milestoneEffect("a", 7));
				return extra.floor();
			},
		},
		12: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(5);
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(FER)TILITY",
			display() {return "multiply population gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 4)) extra = extra.add(milestoneEffect("a", 4));
				if (hasMilestone("a", 9)) extra = extra.add(milestoneEffect("a", 9));
				return extra.floor();
			},
		},
		13: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(1.25);
				if (hasMilestone("a", 1)) base = base.add(milestoneEffect("a", 1));
				if (hasMilestone("a", 5)) base = base.add(milestoneEffect("a", 5));
				if (hasMilestone("a", 10)) base = base.add(milestoneEffect("a", 10));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(ANA)LYTICITY",
			display() {return "divide acclimation requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {return new Decimal(0)},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(3);
				if (hasMilestone("a", 2)) base = base.mul(milestoneEffect("a", 2));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(SOV)EREIGNTY",
			display() {return "multiply population amount in population effects by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost())},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 6)) extra = extra.add(milestoneEffect("a", 6));
				return extra.floor();
			},
		},
		respec() {
			setBuyableAmount("a", 11, new Decimal(0));
			setBuyableAmount("a", 12, new Decimal(0));
			setBuyableAmount("a", 13, new Decimal(0));
			setBuyableAmount("a", 14, new Decimal(0));
			player.a.spent = new Decimal(0);
			doReset("a", true, true);
		},
		respecText: "respec acclimation points",
	},
	milestones: {
		0: {
			requirement: 5,
			requirementDescription: "CRA enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
		},
		1: {
			requirement: 6,
			requirementDescription: "ANA enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.11},
			effectDescription() {return "increase the base effect of ANA by 0.11<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		2: {
			requirement: 7,
			requirementDescription: "SOV enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(10).add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		3: {
			requirement: 8,
			requirementDescription: "Population enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 6},
			effectDescription() {return "multiply the last population effect by 6<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		4: {
			requirement: 9,
			requirementDescription: "FER enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra FER levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		5: {
			requirement: 10,
			requirementDescription: "ANA enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.39},
			effectDescription() {return "increase the base effect of ANA by 0.39<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		6: {
			requirement: 11,
			requirementDescription: "SOV enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra SOV levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		7: {
			requirement: 13,
			requirementDescription: "CRA enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra CRA levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		8: {
			requirement: 14,
			requirementDescription: "Population enhancement II",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "change the formula of the first population effect<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		9: {
			requirement: 16,
			requirementDescription: "FER enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1},
			effectDescription() {return "increase extra FER levels by 1<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		10: {
			requirement: 17,
			requirementDescription: "ANA enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {return "increase the base effect of ANA by 0.25<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		11: {
			requirement: 18,
			requirementDescription: "Population enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2.5},
			effectDescription() {return "multiply the second population effect by 2.5<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		12: {
			requirement: 20,
			requirementDescription: "Retrogression enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "unlock the 6th retrogression<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		13: {
			requirement: 24,
			requirementDescription: "CRA enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.25)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
	},
});

addLayer("sp", {
	name: "Species",
	symbol: "SP",
	position: 0,
	branches: ["e"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#4AA40E",
	resource: "species",
	row: 3,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(60),
	type: "static",
	base: 1.5,
	exponent: 1,
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {return [
		new Decimal(2).pow(player.sp.points),
		player.sp.points.add(1),
		player.sp.points.mul(5).add(1).pow(0.2),
	]},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.sp.effect[0]) + ", multiplying the first four evolution effects by " + format(tmp.sp.effect[1]) + "x, and exponentiating evolution amount in the last evolution effect by ^" + format(tmp.sp.effect[2])},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "You keep retrogressions on species resets.<br><br>After your first species reset, you can always bulk growth and evolutions,<br>the effect of <b>Growth enhancement I</b> is always changed,<br>and more automation for growth is always unlocked.<br><br>These extra effects will not go away even if this layer is reset."],
		"blank",
	],
	layerShown() {return player.e.points.gte(60) || player.sp.unlocked},
	hotkeys: [{
		key: "p",
		description: "P: reset for species",
		onPress() {if (player.sp.unlocked) doReset("sp")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep);
	},
});
