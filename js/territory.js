const controlNodeName = ["Assimilation", "Politics", "Leadership", "Commitment", "Capacity", "Structure"];

const controlNodeReq = [[
	(x = 0) => x + 3,
	(x = 0) => new Decimal(10).pow(x ** buyableEffect("t", 12)),
	(x = 0) => x + 12,
	(x = 0) => (4 * (x ** buyableEffect("t", 12)) + 7) * 11,
	(x = 0) => x + 11,
	(x = 0) => (x ** buyableEffect("t", 12) + 3) * 1000,
], [
	(x = 0) => (x + (hasMilestone("r", 35) ? 1 : 2)) * 2,
	(x = 0) => new Decimal(hasMilestone("r", 35) ? 1e7 : 5e7).pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => (x + (hasMilestone("r", 35) ? 7 : 8)) * 2,
	(x = 0) => (x ** buyableEffect("t", 12) + (hasMilestone("r", 35) ? 4 : 5)) * 50,
	(x = 0) => (x + (hasMilestone("r", 35) ? 6 : 7)) * 2,
	(x = 0) => (x ** buyableEffect("t", 12) + (hasMilestone("r", 35) ? 4 : 5)) * 1000,
], [
	(x = 0) => (x + 2) * 5,
	(x = 0) => new Decimal(1e50).pow(x ** buyableEffect("t", 12) + 1),
	(x = 0) => (x + 3) * 5,
	(x = 0) => (x ** buyableEffect("t", 12) + 2) * 100,
	(x = 0) => (x + 2) * 5,
	(x = 0) => (x ** buyableEffect("t", 12) + 6) * 1000,
]];

function getControlNodeTimeSpeed() {
	let timeSpeed = 1;
	if (hasMilestone("d", 54)) timeSpeed *= milestoneEffect("d", 54);
	return timeSpeed;
}

addLayer("t", {
	name: "Territory",
	symbol: "T",
	position: 2,
	branches: ["ex", "d", "w"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		controlUnlocked: false,
		control: new Decimal(0),
		extra: {},
	}},
	color: "#E03330",
	nodeStyle() {if (tmp.t.canReset || player.t.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #E03330, #C77055)"}},
	resource: "territories",
	row: 5,
	baseResource: "domination points",
	baseAmount() {return player.d.points},
	requires: new Decimal(100000),
	type: "static",
	base() {
		let base = 1.5;
		if (hasMilestone("r", 41)) base -= milestoneEffect("r", 41);
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.cy.unlocked},
	resetDescription: "Subjugate for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {
		let controlEff2Exp = 0.1;
		if (hasMilestone("r", 37)) controlEff2Exp += 0.1;
		if (getBuyableAmount("t", 12).gte(2)) controlEff2Exp += 0.01;
		let eff = [
			new Decimal(10).pow(player.t.points),
			new Decimal(5).pow(player.t.points),
			player.t.points.div(4).add(1),
			player.t.control.add(1).log10().add(1).pow(getBuyableAmount("t", 11) ? 0.28 : 0.1),
			(hasMilestone("d", 56) ? player.t.control.add(1).log10().div(10).add(1).pow(controlEff2Exp) : new Decimal(1)),
			(hasMilestone("d", 60) ? player.t.control.add(1).log10().add(1) : new Decimal(1)),
		];
		if (eff[3].gt(1.42) && !getBuyableAmount("t", 11).gte(1)) eff[3] = eff[3].sub(1.42).div(10).add(1.42);
		return eff;
	},
	effectDescription() {return "which are dividing the expansion requirement by /" + format(tmp.t.effect[0]) + ", dividing the war requirement by /" + format(tmp.t.effect[1]) + ", and directly multiplying domination point gain by " + format(tmp.t.effect[2]) + "x"},
	tabFormat() {
		let text = "You keep domination enhancements on continent resets.<br><br>After subjugating 1 time, you bulk 10x stats from rows 3 and below.<br><br>The above extra effect will not go away even if this layer is reset.";
		if (player.t.points.gte(9)) text += "<br><br>After subjugating 10 times, the first war effect is changed<br>and you always have everything that costs battles.";
		if (player.t.controlUnlocked) {
			text += "<br><br>You have <h2 style='color: #E03330; text-shadow: #E03330 0px 0px 10px'>" + format(player.t.control) + "</h2> control, directly multiplying acclimation point gain by " + format(tmp.t.effect[3]) + "x";
			if (hasMilestone("d", 60)) text += ", directly multiplying domination point gain by " + format(tmp.t.effect[4]) + "x, and dividing the expansion requirement by /" + format(tmp.t.effect[5]);
			else if (hasMilestone("d", 56)) text += " and directly multiplying domination point gain by " + format(tmp.t.effect[4]) + "x";
			text += "<br><br>If two control nodes generate the same thing, the generation is (gen1 + 1)(gen2 + 1).<br>By default, each control node maxes out at 100 seconds of production.";
		};
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.t.controlUnlocked) arr.push(["contained-grid", "calc(100% - 34px)"], "blank", "buyables", "blank");
		return arr;
	},
	layerShown() {return challengeCompletions("ec", 11) >= 16 || player.t.unlocked},
	hotkeys: [{
		key: "t",
		description: "T: reset for territories",
		onPress() {if (player.t.unlocked) doReset("t")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("t", keep);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 18 && !player.t.controlUnlocked) player.t.controlUnlocked = true;
		if (player.t.controlUnlocked) {
			diff *= getControlNodeTimeSpeed();
			player.t.control = player.t.control.add(gridEffect("t", 101).mul(diff)).min(gridEffect("t", 101).mul(100));
			for (let row = 1; row <= tmp.t.grid.rows; row++) {
				for (let col = 1; col <= layers.t.grid.cols; col++) {
					const id = row * 100 + col;
					let eff = new Decimal(0);
					if (getGridData("t", id + 1) && getGridData("t", id + 100)) eff = gridEffect("t", id + 1).add(1).mul(gridEffect("t", id + 100).add(1));
					else if (getGridData("t", id + 1)) eff = gridEffect("t", id + 1);
					else if (getGridData("t", id + 100)) eff = gridEffect("t", id + 100);
					if (eff) player.t.extra[id] = player.t.extra[id].add(eff.mul(diff)).min(eff.mul(100));
				};
			};
		};
	},
	shouldNotify() {
		if (player.t.controlUnlocked) {
			for (let row = 1; row <= tmp.t.grid.rows; row++)
				for (let col = 1; col <= layers.t.grid.cols; col++)
					if (layers.t.grid.getCanClick(getGridData("t", row * 100 + col), row * 100 + col)) return true;
			for (const key in tmp.t.buyables)
				if (tmp.t.buyables[key]?.unlocked && tmp.t.buyables[key]?.canAfford) return true;
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.t.canReset && tmp.t.nodeStyle) return tmp.t.nodeStyle},
		"contained-grid"() {return {"box-sizing": "border-box", "border": "2px solid #E03330", "padding": "16px"}},
		"gridable"() {return {"width": "120px", "height": "120px", "border-radius": "0px"}},
	},
	grid: {
		rows() {return 2 + getBuyableAmount("t", 11).toNumber()},
		maxRows: controlNodeReq.length,
		cols: controlNodeReq[0].length,
		getStartData(id) {return 0},
		getCanClick(data, id) {
			if (id % 100 == 6) return player.co.settlers.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 5) return player.co.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 4) return tmp.l.effect[4] >= controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data);
			if (id % 100 == 3) return player.l.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 2) return player.t.control.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			if (id % 100 == 1) return player.t.points.gte(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data));
			return false;
		},
		onClick(data, id) {player.t.grid[id]++},
		onHold(data, id) {player.t.grid[id]++},
		getTitle(data, id) {return controlNodeName[id % 100 - 1] + (id >= 200 ? "<sup>" + Math.floor(id / 100) + "</sup>" : "")},
		getDisplay(data, id) {
			let text = "producing " + format(gridEffect("t", id)) + " ";
			if (id == 101) text += "control";
			else if (id < 200) text += "of left node";
			else if (id % 100 <= 1) text += "of above node";
			else text += "of above and left nodes";
			text += " per second<br><br>Req: " + formatWhole(controlNodeReq[Math.floor(id / 100) - 1][id % 100 - 1](data)) + " ";
			if (id % 100 == 6) text += "settlers";
			else if (id % 100 == 5) text += "continents";
			else if (id % 100 == 4) text += "focus+ points";
			else if (id % 100 == 3) text += "leaders";
			else if (id % 100 == 2) text += "control";
			else if (id % 100 == 1) text += "territories";
			else text += "???";
			text += "<br><br>Bought: " + formatWhole(data) + (player.t.extra[id].gte(1) ? " + " + formatWhole(player.t.extra[id].floor()) : "");
			return text;
		},
		getEffect(data, id) {
			if (data < 1) return new Decimal(0);
			return player.t.extra[id].floor().add(data).mul(new Decimal(10).pow(data - 1));
		},
		getUnlocked(id) {return player.t.controlUnlocked},
	},
	buyables: {
		11: {
			cost() {return [1e80][getBuyableAmount(this.layer, this.id).toNumber()] || Infinity},
			title: "Greater Control",
			display() {return "unlock another row of control nodes<br><br>on first buy, also improves the first control effect<br><br>Cost: " + format(this.cost()) + " control<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + this.purchaseLimit},
			purchaseLimit: 1,
			canAfford() {return player.t.control.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		12: {
			cost() {return [1e136, 1e207, 1e280][getBuyableAmount(this.layer, this.id).toNumber()] || Infinity},
			title: "Cheaper Policies",
			display() {return "decreases the cost scaling of all levels of <b>Politics</b>, <b>Commitment</b>, and <b>Structure</b><br><br>on second buy, also improves the second control effect<br><br>Cost: " + format(this.cost()) + " control<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + this.purchaseLimit},
			effect() {return 1 / (1.5 ** getBuyableAmount(this.layer, this.id).toNumber()) + 1},
			purchaseLimit: 3,
			canAfford() {return player.t.control.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player.t.control = player.t.control.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
	},
});
