const warUpgrades = [
	[
		{title: "Display of Power", desc() {return "divides domination requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.add(2)}, cost: 1},
		{title: "Violent Expansion", desc() {return "divides expansion requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.div(2).add(1)}, cost: 2},
		{title: "Wilderness Exploration", desc() {return "divides species requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.pow_base(1e5)}, cost: 4},
	], [
		{title: "Forced Migration", desc() {return "increases the 10th hybridization's completion limit based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(2)}, cost: 2},
		{title: "Out of Place, Out of Time", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 4},
		{title: "Displaced Chronology", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 8},
	],
	[
		{title: "Enroaching Influence", desc: "unlocks another influence generator", cost: 4},
		{title: "Greater Empowerment", desc: "reduces <b>Influence empowerment</b>'s cost", cost: 8},
		{title: "???", desc: "coming soon!", cost: 16},
	],
];

addLayer("w", {
	name: "War",
	symbol: "W",
	position: 3,
	branches: ["d"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
	}},
	color: "#C77055",
	resource: "wars",
	row: 4,
	baseResource: "domination points",
	baseAmount() {return player.d.points},
	requires: new Decimal(200),
	type: "static",
	base() {
		let base = 2;
		if (challengeCompletions("ec", 11) >= 11 && challengeEffect("ec", 11)[10]) base -= challengeEffect("ec", 11)[10];
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Declare war for ",
	gainMult() {
		let mult = new Decimal(1);
		if (getBuyableAmount("d", 14).gte(tmp.d.buyables[14].purchaseLimit)) mult = mult.div(tmp.d.buyables[14].completionEffect);
		return mult;
	},
	effect() {return player.w.points.pow(1.5).round()},
	effectDescription() {return "which are giving " + formatWhole(tmp.w.effect) + " battles, of which " + formatWhole(tmp.w.effect.sub(player.w.spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep all domination enhancements on war resets.<br><br>After declaring war 1 time, consciousness resets no longer reset anything<br>and you automatically claim potential conscious beings.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.w.points.gte(2)) text += "<br><br>After declaring war 3 times, you keep domination enhancements on all resets.";
			if (player.w.points.gte(5)) text += "<br>After declaring war 6 times, you bulk 10x stats from rows 3 and below.";
			return text;
		}],
		"blank",
		"grid",
		"blank",
		"respec-button",
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.w.unlocked},
	hotkeys: [{
		key: "w",
		description: "W: reset for wars",
		onPress() {if (player.w.unlocked) doReset("w")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("w", keep);
	},
	componentStyles: {
		"gridable"() {return {"width": "120px", "height": "120px", "border-radius": "0px"}},
	},
	grid: {
		rows: 3,
		cols: 3,
		getStartData(id) {return 0},
		getCanClick(data, id) {return data == 0 && tmp[this.layer].effect.sub(player[this.layer].spent).gte(warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].cost) && (id == 101 || getGridData(this.layer, id - 1) || getGridData(this.layer, id + 1) || getGridData(this.layer, id - 100) || getGridData(this.layer, id + 100))},
		onClick(data, id) {
			player[this.layer].spent = player[this.layer].spent.add(warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].cost);
			player[this.layer].grid[id]++;
		},
		getTitle(data, id) {return warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].title},
		getDisplay(data, id) {
			if (!(id == 101 || getGridData(this.layer, id - 1) || getGridData(this.layer, id + 1) || getGridData(this.layer, id - 100) || getGridData(this.layer, id + 100))) return;
			let upg = warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1];
			return (typeof upg.desc == "function" ? upg.desc() : upg.desc) + "<br><br>Cost: " + formatWhole(upg.cost) + " battles";
		},
		getEffect(data, id) {
			if (!id) return;
			let eff = warUpgrades[Math.floor(id / 100) - 1][id % 100 - 1].effect;
			if (typeof eff == "function") return eff();
			return eff;
		},
		getStyle(data, id) {
			if (data > 0) return {"background-color": "#77bf5f", "cursor": "default"};
			if (!(id == 101 || getGridData(this.layer, id - 1) || getGridData(this.layer, id + 1) || getGridData(this.layer, id - 100) || getGridData(this.layer, id + 100))) return {"background-color": "#FFFFFF40"};
		},
	},
	buyables: {
		respec() {
			for (const key in player.w.grid) {
				if (Object.hasOwnProperty.call(player.w.grid, key)) {
					player.w.grid[key] = tmp.w.grid.getStartData;
				};
			};
			player.w.spent = new Decimal(0);
			doReset("w", true, true);
		},
		respecText: "respec battles",
	},
});
