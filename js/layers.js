const generatorCostScale = {
	101() {
		if (hasUpgrade("g", 24)) return 3;
		if (hasUpgrade("g", 23)) return 4;
		return 5;
	},
	201() {
		if (hasUpgrade("g", 25)) return 15;
		if (hasUpgrade("g", 22)) return 50;
		return 100;
	},
	202() {
		if (hasUpgrade("g", 14)) return 30;
		return 500;
	},
	301() {
		if (hasUpgrade("g", 31)) return 64;
		return 1000;
	},
	302() {return 5000},
	303() {return 50},
};

const generatorExtraCost = {
	301() {return 5e13},
	302() {return 1e14},
	303() {
		if (hasUpgrade("g", 32)) return 1000000;
		return 1e17;
	},
};

const generatorName = {
	101: "Basic Generator",
	201: "Generator Generator 1",
	202: "Generator Generator 2",
	301: "Left Generator",
	302: "Center Generator",
	303: "Right Generator",
};

function generatorCost(id) {
	let bought = player.g.grid[id].bought;
	let scale = generatorCostScale[id]();
	let extra = generatorExtraCost[id];
	if (typeof extra == "function") return new Decimal(scale).pow(bought ** 1.25 + 1).mul(extra());
	return new Decimal(scale).pow(bought ** 1.25 + 1);
};

addLayer("g", {
	name: "Generators",
	symbol: "G",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		passive: new Decimal(0),
		autoBasic: false,
	}},
	color: "#A3D9A5",
	resource: "generator power",
	row: 0,
	effect() {return player.g.points.add(1).pow(0.75)},
	effectDescription() {return "which is multiplying point gain by " + format(tmp.g.effect) + "x"},
	tabFormat: [
		"main-display",
		["display-text", () => {return "You are gaining " + format(player.g.passive) + " generator power per second<br><br>Note: most forms of passive production cap out at 100 seconds worth of production"}],
		"blank",
		"grid",
		"blank",
		"upgrades",
	],
	layerShown() {return true},
	doReset(resettingLayer) {
		let keep = ["autoBasic"];
		if (hasMilestone("b", 3)) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) layerDataReset("g", keep);
	},
	update(diff) {
		let gain = gridEffect("g", 101);
		if (hasUpgrade("g", 21)) gain = gain.mul(upgradeEffect("g", 21));
		if (hasUpgrade("g", 33)) gain = gain.mul(upgradeEffect("g", 33));
		if (hasUpgrade("g", 34)) gain = gain.mul(upgradeEffect("g", 34));
		if (hasUpgrade("g", 35)) gain = gain.mul(upgradeEffect("g", 35));
		if (hasUpgrade("b", 14)) gain = gain.mul(upgradeEffect("b", 14));
		player.g.passive = gain;
		if (productionCap && player.g.points.add(gain.mul(diff)).gte(gain.mul(productionCap))) {
			player.g.points = gain.mul(productionCap);
		} else {
			player.g.points = player.g.points.add(gain.mul(diff)).max(0);
		};
		for (let id in player.g.grid) {
			if (gridEffect("g", id).gt(0)) {
				let gen = new Decimal(0);
				let extra = new Decimal(0);
				let checkId = Number(id) + 100;
				if (gridEffect("g", checkId).gt(0)) {
					if (gen.eq(0)) gen = new Decimal(1);
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				checkId = Number(id) + 101;
				if (gridEffect("g", checkId).gt(0)) {
					if (gen.eq(0)) gen = new Decimal(1);
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				gen = gen.max(extra);
				if (productionCap && gen.gt(0) && player.g.grid[id].amount.add(gen.mul(diff)).gte(gen.mul(productionCap))) {
					player.g.grid[id].amount = gen.mul(productionCap);
				} else {
					player.g.grid[id].amount = player.g.grid[id].amount.add(gen.mul(diff)).max(0);
				};
			};
		};
	},
	automate() {
		if (hasMilestone("sb", 0) && player.g.autoBasic) {
			if (player.points.gte(generatorCost(101))) {
				player.points = player.points.sub(generatorCost(101));
				player.g.grid[101].bought++;
				player.g.grid[101].amount = player.g.grid[101].amount.add(1);
			};
		};
	},
	componentStyles: {
		"gridable"() {return {"width": "105px", "height": "105px"}},
		"upgrade"() {return {"width": "125px", "height": "125px"}},
	},
	grid: {
		rows() {
			let rows = 2;
			if (hasMilestone("b", 1)) rows++;
			return rows;
		},
		cols: 3,
		maxRows: 3,
		getStartData(id) {
			return {
				bought: 0,
				amount: new Decimal(0),
			};
		},
		getUnlocked(id) {
			return id % 100 < id / 100;
		},
		getCanClick(data, id) {
			return player.points.gte(generatorCost(id));
		},
		onClick(data, id) {
			player.points = player.points.sub(generatorCost(id));
			player.g.grid[id].bought++;
			player.g.grid[id].amount = player.g.grid[id].amount.add(1);
		},
		onHold(data, id) {
			if (player.points.gte(generatorCost(id))) {
				player.points = player.points.sub(generatorCost(id));
				player.g.grid[id].bought++;
				player.g.grid[id].amount = player.g.grid[id].amount.add(1);
			};
		},
		getTitle(data, id) {
			return generatorName[id];
		},
		getDisplay(data, id) {
			return "<br>Amount: " + format(data.amount) + "(" + formatWhole(data.bought) + ")<br><br>Cost: " + format(generatorCost(id)) + " points";
		},
		getEffect(data, id) {
			if (!data) return new Decimal(0);
			return data.amount.mul(data.bought);
		},
	},
	upgrades: {
		11: {
			title: "Basic Points",
			description: "Bought Basic Generators multiply point gain.",
			effect() {return Math.max(player.g.grid[101].bought, 1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(10000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return getGridData("g", 201).bought >= 2 || player.b.unlocked},
		},
		12: {
			title: "Triple Points",
			description: "Triple point gain.",
			effect() {return new Decimal(3)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(100000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 11)},
		},
		13: {
			title: "Point Points",
			description: "[Points ^ 0.08] multiply point gain.",
			effect() {return player.points.pow(0.08).max(1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 12)},
		},
		14: {
			title: "Cheaper 2",
			description: "Reduce Generator Generator 2 cost scaling.<br><br>Effect: 500 -> 30",
			cost: new Decimal(10000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 13)},
		},
		15: {
			title: "Upgrade Points",
			description: "[2 ^ upgrades] multiply point gain.",
			effect() {return 2 ** player.g.upgrades.length},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(100000000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 14)},
		},
		21: {
			title: "Point Power",
			description: "[Points ^ 0.1] multiply generator power gain.",
			effect() {return player.points.pow(0.1)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e11),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 15) && hasMilestone("b", 0)},
		},
		22: {
			title: "Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling.<br><br>Effect: 100 -> 50",
			cost: new Decimal(1e12),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 21) && hasMilestone("b", 0)},
		},
		23: {
			title: "Cheaper Basic",
			description: "Reduce Basic Generator cost scaling.<br><br>Effect: 5 -> 4",
			cost: new Decimal(2e13),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 22) && hasMilestone("b", 0)},
		},
		24: {
			title: "Even Cheaper Basic",
			description: "Reduce Basic Generator cost scaling again.<br><br>Effect: 4 -> 3",
			cost: new Decimal(2e14),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 23) && hasMilestone("b", 0)},
		},
		25: {
			title: "Even Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling again.<br><br>Effect: 50 -> 15",
			cost: new Decimal(5e15),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 24) && hasMilestone("b", 0)},
		},
		31: {
			title: "Cheaper Left",
			description: "Reduce Left Generator cost scaling.<br><br>Effect: 1,000 -> 64",
			cost: new Decimal(1e34),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 25) && hasMilestone("b", 2)},
		},
		32: {
			title: "Cheaper Right",
			description: "Reduce Right Generator base cost.<br><br>Effect: 1e17 -> 1,000,000",
			cost: new Decimal(1e37),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 31) && hasMilestone("b", 2)},
		},
		33: {
			title: "Super Power",
			description: "[Super Boosters * 2] multiply generator power gain.",
			effect() {return player.sb.points.mul(2)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e39),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 32) && hasMilestone("b", 2)},
		},
		34: {
			title: "Basic Power",
			description: "[1.1 ^ Bought Basic Generators] multiply generator power gain.",
			effect() {return new Decimal(1.1).pow(player.g.grid[101].bought)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e44),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 33) && hasMilestone("b", 2)},
		},
		35: {
			title: "1 and 2 Power",
			description: "[1.1 ^ Bought Generator Generators 1 and 2] multiply generator power gain.",
			effect() {return new Decimal(1.1).pow(player.g.grid[201].bought + player.g.grid[202].bought)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e50),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 34) && hasMilestone("b", 2)},
		},
	},
});

addLayer("b", {
	name: "Boosters",
	symbol: "B",
	position: 0,
	branches: ["g"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#6E64C4",
	resource: "boosters",
	row: 1,
	baseResource: "points",
	baseAmount() {return player.points},
	requires: new Decimal(1e11),
	type: "static",
	exponent: 1.25,
	base() {
		if (hasUpgrade("b", 12)) return 4.5;
		return 5;
	},
	gainMult() {
		let mult = new Decimal(1);
		if (hasUpgrade("b", 13)) mult = mult.div(upgradeEffect("b", 13));
		if (hasUpgrade("b", 15)) mult = mult.div(upgradeEffect("b", 15));
		return mult;
	},
	canBuyMax() {return false},
	effect() {
		let base = new Decimal(2);
		if (player.sb.unlocked) base = base.add(tmp.sb.effect);
		return base.pow(player.b.points);
	},
	effectDescription() {return "which are multiplying point gain by " + format(tmp.b.effect) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		"milestones",
		"upgrades",
	],
	layerShown() {return hasUpgrade("g", 15) || player.b.unlocked},
	hotkeys: [{
		key: "b",
		description: "B: reset for boosters",
		onPress() {if (player.b.unlocked) doReset("b")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("b", keep);
	},
	componentStyles: {
		"upgrade"() {return {"width": "125px", "height": "125px"}},
	},
	milestones: {
		0: {
			requirementDescription: "2 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(2)},
		},
		1: {
			requirementDescription: "6 boosters",
			effectDescription: "unlocks a new row of generators",
			done() {return player.b.points.gte(6)},
		},
		2: {
			requirementDescription: "18 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(18)},
		},
		3: {
			requirementDescription: "28 boosters",
			effectDescription: "unlocks booster upgrades<br>keeps generator upgrades on reset",
			done() {return player.b.points.gte(28)},
		},
	},
	upgrades: {
		11: {
			title: "Cheaper Super",
			description: "Reduces super booster scaling.<br><br>Effect: 10,000 -> 2,500",
			cost: new Decimal(1e55),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasMilestone("b", 3)},
		},
		12: {
			title: "Cheaper Boosters",
			description: "Reduces booster scaling.<br><br>Effect: 5 -> 4.5",
			cost: new Decimal(1e61),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 11) && hasMilestone("b", 3)},
		},
		13: {
			title: "Power Boosters",
			description: "[Generator Power ^ 0.1] divides booster cost.",
			effect() {return player.g.points.pow(0.1).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e64),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 12) && hasMilestone("b", 3)},
		},
		14: {
			title: "Boost Power",
			description: "[1.16 ^ Boosters] multiplies generator power gain.",
			effect() {return new Decimal(1.16).pow(player.b.points)},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(1e68),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 13) && hasMilestone("b", 3)},
		},
		15: {
			title: "Point Boosters",
			description: "[Points ^ 0.048] divides booster cost.",
			effect() {return player.points.pow(0.048).max(1)},
			effectDisplay() {return "/" + format(this.effect())},
			cost: new Decimal(1e74),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("b", 14) && hasMilestone("b", 3)},
		},
	},
});

addLayer("sb", {
	name: "Super Boosters",
	symbol: "SB",
	position: 1,
	branches: ["b"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#504899",
	resource: "super boosters",
	row: 1,
	baseResource: "points",
	baseAmount() {return player.points},
	requires: new Decimal(1e24),
	type: "static",
	exponent: 2,
	base() {
		if (hasUpgrade("b", 11)) return 2500;
		return 10000;
	},
	canBuyMax() {return false},
	effect() {return player.sb.points},
	effectDescription() {return "which are increasing the booster effect base by +" + format(tmp.sb.effect)},
	tabFormat: [
		"main-display",
		"prestige-button",
		"blank",
		"milestones",
	],
	layerShown() {return player.b.points.gte(11) || player.sb.unlocked},
	hotkeys: [{
		key: "s",
		description: "S: reset for super boosters",
		onPress() {if (player.sb.unlocked) doReset("sb")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("sb", keep);
	},
	milestones: {
		0: {
			requirementDescription: "5 super boosters",
			effectDescription: "unlocks autobuy for Basic Generator",
			toggles: [["g", "autoBasic"]],
			done() {return player.sb.points.gte(5)},
		},
	},
});
