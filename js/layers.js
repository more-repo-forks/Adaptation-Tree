// booster color: #6E64C4
// super booster color: #504899
// generator color: #A3D9A5
// super generator color: #248239

const generatorCostBase = {
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
};

const generatorName = {
	101: "Basic Generator",
	201: "Generator Generator 1",
	202: "Generator Generator 2",
};

function generatorCost(id) {
	let bought = player.g.grid[id].bought;
	return new Decimal(generatorCostBase[id]()).pow(bought ** 1.25 + 1);
};

addLayer("g", {
	name: "Generators",
	symbol: "G",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
		passive: new Decimal(0),
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
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("g", keep);
	},
	update(diff) {
		let gain = gridEffect("g", 101);
		if (hasUpgrade("g", 21)) gain = gain.mul(upgradeEffect("g", 21));
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
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				checkId = Number(id) + 101;
				if (gridEffect("g", checkId).gt(0)) {
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
	componentStyles: {
		"gridable"() {return {"width": "100px", "height": "100px"}},
	},
	grid: {
		rows: 2,
		cols: 2,
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
			effect() {return player.g.grid[101].bought},
			effectDisplay() {return format(this.effect()) + "x"},
			cost: new Decimal(10000),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return getGridData("g", 201).bought >= 2},
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
			effect() {return player.points.pow(0.08)},
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
			cost: new Decimal(5000000),
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
			cost: new Decimal(45000000),
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
			cost: new Decimal(5e10),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 15) && hasMilestone("b", 0)},
		},
		22: {
			title: "Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling.<br><br>Effect: 100 -> 50",
			cost: new Decimal(5e11),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 21) && hasMilestone("b", 0)},
		},
		23: {
			title: "Cheaper Basic",
			description: "Reduce Basic Generator cost scaling.<br><br>Effect: 5 -> 4",
			cost: new Decimal(5e12),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 22) && hasMilestone("b", 0)},
		},
		24: {
			title: "Even Cheaper Basic",
			description: "Reduce Basic Generator cost scaling.<br><br>Effect: 4 -> 3",
			cost: new Decimal(5e13),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 23) && hasMilestone("b", 0)},
		},
		25: {
			title: "Even Cheaper 1",
			description: "Reduce Generator Generator 1 cost scaling.<br><br>Effect: 50 -> 15",
			cost: new Decimal(5e14),
			currencyDisplayName: "points",
			currencyInternalName: "points",
			currencyLocation() {return player},
			unlocked() {return hasUpgrade("g", 24) && hasMilestone("b", 0)},
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
	requires: new Decimal(2e10),
	type: "static",
	exponent: 1.25,
	base: 5,
	canBuyMax() {return false},
	effect() {return new Decimal(2).pow(player.b.points)},
	effectDescription() {return "which are multiplying point gain by " + format(tmp.b.effect) + "x"},
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
	milestones: {
		0: {
			requirementDescription: "2 boosters",
			effectDescription: "unlocks more generator upgrades",
			done() {return player.b.points.gte(2)},
		},
	},
});
