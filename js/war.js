const warUpgrades = [
	[
		{title: "Display of Power", desc() {return "divides domination requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.add(2)}, cost: 1},
		{title: "Violent Expansion", desc() {return "divides expansion requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.div(2).add(1)}, cost: 2},
		{title: "Wilderness Exploration", desc() {return "divides species requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.pow_base(1e5)}, cost: 4},
		{title: "Nature Investigation", desc() {return "divides ecosystem requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.div(3).add(1)}, cost: 25},
		{title: "Solace Seeking", desc() {return "divides conscious being requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.pow_base("1e5000")}, cost: 150},
		{title: "Revolutionary Tactics", desc() {return "divides revolution requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.div(10).add(1)}, cost: 1000},
	], [
		{title: "Forced Migration", desc() {return "increases the 10th hybridization's completion limit based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(2)}, cost: 2},
		{title: "Out of Place, Out of Time", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 4},
		{title: "Displaced Chronology", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 8},
		{title: "Decreased Habitable Area", desc() {return "increases the 10th hybridization's completion limit based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(3)}, cost: 30},
		{title: "Ancient Tactics", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 200},
		{title: "Futuristic Tactics", desc: "unlocks another ANACHRONISM tier", effect: 1, cost: 1500},
	], [
		{title: "Enroaching Influence", desc: "unlocks another influence generator", cost: 4},
		{title: "Greater Empowerment", desc: "reduces <b>Influence empowerment</b>'s cost", cost: 8},
		{title: "Surrounding Influence", desc: "unlocks another influence generator", cost: 16},
		{title: "Generator Recycling", desc: "reduces the costs of influence generators", cost: 40},
		{title: "Overarching Influence", desc: "unlocks another influence generator", cost: 250},
		{title: "Greater Tickspeed", desc: "reduces <b>Influence tickspeed</b>'s cost", cost: 2000},
	], [
		{title: "Conflict Escalation", desc: "decreases war requirement base by 0.025", effect: 0.025, cost: 25},
		{title: "Battle Domination", desc: "decreases domination requirement base by 0.313", effect: 0.313, cost: 30},
		{title: "Revolutionary Armaments", desc: "decreases revolution requirement base by 0.1", effect: 0.1, cost: 40},
		{title: "New Frontiers", desc: "decreases species requirement base by 0.075", effect: 0.075, cost: 55},
		{title: "Further Exploration", desc: "decreases expansion requirement base by 0.1", effect: 0.1, cost: 300},
		{title: "???", desc: "coming soon!", cost: 2500},
	], [
		{title: "Further Domination", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points}, cost: 150},
		{title: "Further Acclimation", desc() {return "gives extra CRA, FER, ANA, and SOV based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(75000)}, cost: 200},
		{title: "Military Domination", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(2)}, cost: 250},
		{title: "Forced Acclimation", desc() {return "gives extra CRA, FER, ANA, and SOV based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(220000)}, cost: 300},
		{title: "Overpowering Presence", desc() {return "gives extra FOC, SPE, CLI, and DOM based on wars<br>(currently +" + formatWhole(this.effect()) + ")"}, effect() {return player.w.points.mul(5)}, cost: 350},
		{title: "???", desc: "coming soon!", cost: 3000},
	], [
		{title: "Honed Focus", desc() {return "divides focus+ requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.add(1).pow(0.1)}, cost: 1000},
		{title: "Public Speaking", desc: "improves the last leader effect", cost: 1500},
		{title: "Political Upheaval", desc() {return "divides leader requirement based on wars<br>(currently /" + format(this.effect()) + ")"}, effect() {return player.w.points.add(1).pow(0.2)}, cost: 2000},
		{title: "???", desc: "coming soon!", cost: 2500},
		{title: "???", desc: "coming soon!", cost: 3000},
		{title: "???", desc: "coming soon!", cost: 3500},
	],
];

addLayer("w", {
	name: "War",
	symbol: "W",
	position: 3,
	branches: [["cb", 2], "d"],
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
		if (challengeCompletions("ec", 11) >= 13 && challengeEffect("ec", 11)[12]) base -= challengeEffect("ec", 11)[12];
		if (challengeCompletions("ec", 11) >= 14 && challengeEffect("ec", 11)[13]) base -= challengeEffect("ec", 11)[13];
		if (hasMilestone("r", 17)) base -= milestoneEffect("r", 17);
		if (hasMilestone("r", 18)) base -= milestoneEffect("r", 18);
		if (hasMilestone("r", 24)) base -= milestoneEffect("r", 24);
		if (getGridData("w", 401)) base -= gridEffect("w", 401);
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3)},
	resetDescription: "Declare war for ",
	gainMult() {
		let mult = new Decimal(1);
		if (getBuyableAmount("d", 14).gte(tmp.d.buyables[14].purchaseLimit)) mult = mult.div(tmp.d.buyables[14].completionEffect);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	effect() {
		let exp = 1.5;
		if (player.ex.points.gte(9)) exp += 0.1;
		if (hasMilestone("r", 16)) exp += 0.15;
		if (hasMilestone("r", 21)) exp += 0.15;
		if (player.w.points.gte(50)) exp += 0.05;
		return player.w.points.pow(exp).round();
	},
	effectDescription() {return "which are giving " + formatWhole(tmp.w.effect) + " battles, of which " + formatWhole(tmp.w.effect.sub(player.w.spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep all domination enhancements on war resets.<br><br>After declaring war 1 time, consciousness resets no longer reset anything<br>and you automatically claim potential conscious beings.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.w.points.gte(2)) text += "<br><br>After declaring war 3 times, you keep domination enhancements on all resets.";
			if (player.w.points.gte(5)) text += "<br>After declaring war 6 times, you bulk 10x stats from rows 3 and below.";
			if (player.w.points.gte(8)) text += "<br>After declaring war 9 times, the first war effect is improved.";
			return text;
		}],
		"blank",
		["contained-grid", "calc(100% - 34px)"],
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
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("w", keep);
	},
	componentStyles: {
		"contained-grid"() {return {"box-sizing": "border-box", "border": "2px solid #C77055", "padding": "16px"}},
		"gridable"() {return {"width": "120px", "height": "120px", "border-radius": "0px"}},
	},
	grid: {
		rows() {
			let size = 3;
			if (hasMilestone("d", 41)) size++;
			if (hasMilestone("r", 13)) size++;
			if (hasMilestone("r", 22)) size++;
			return size;
		},
		cols() {return this.rows()},
		maxRows: warUpgrades.length,
		maxCols: warUpgrades[0].length,
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
			for (const key in player.w.grid)
				if (Object.hasOwnProperty.call(player.w.grid, key))
					player.w.grid[key] = tmp.w.grid.getStartData;
			player.w.spent = new Decimal(0);
			doReset("w", true, true);
		},
		respecText: "respec battles",
	},
});
