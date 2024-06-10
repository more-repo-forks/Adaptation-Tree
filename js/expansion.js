function getUnlockedGenerators() {
	let unlocked = 0;
	if (hasMilestone("r", 9)) unlocked++;
	if (getGridData("w", 301)) unlocked++;
	if (getGridData("w", 303)) unlocked++;
	return unlocked;
};

const GENERATOR_COST_BASES = [2, 3, 5, 9, 13, 17];

function getGeneratorCost(id) {
	let amt = getBuyableAmount("ex", id);
	if (getGridData("w", 304)) amt = amt.div(2);
	if (id > 11) amt = amt.add(1);
	if (challengeCompletions("ec", 11) >= 8) return amt.mul(GENERATOR_COST_BASES[id - 11]).round();
	return amt.pow_base(GENERATOR_COST_BASES[id - 11]).round();
};

const GENERATOR_IMPROVEMENTS = ["(b + x) * b<sup>2</sup>", "(b + x) * b<sup>3</sup> * 2<sup>b</sup>", "(b + x) * b<sup>5</sup> * 3<sup>b</sup>", "(10b + x) * b<sup>12</sup> * 5<sup>b</sup>", "(b * EX + x) * b<sup>EX</sup> * 10<sup>b</sup>", "(b + x) * b<sup>55</sup> * EX<sup>b</sup>", "(b + x) * b<sup>EX</sup> * EX<sup>6.6b</sup>"];

function getGeneratorEffect(id) {
	let level = getBuyableAmount("ex", 31).toNumber();
	let b = getBuyableAmount("ex", id);
	let x = player.ex.extra[id - 11].floor();
	let eff = [
		b.add(x).mul(b.pow(2)),
		b.add(x).mul(b.pow(3)).mul(b.pow_base(2)),
		b.add(x).mul(b.pow(5)).mul(b.pow_base(3)),
		b.mul(10).add(x).mul(b.pow(12)).mul(b.pow_base(5)),
		b.mul(player.ex.points).add(x).mul(b.pow(player.ex.points)).mul(b.pow_base(10)),
		b.add(x).mul(b.pow(55)).mul(b.pow_base(player.ex.points)),
		b.add(x).mul(b.pow(player.ex.points)).mul(b.mul(6.6).pow_base(player.ex.points)),
	][level];
	if (hasBuyable("ex", 21)) eff = eff.mul(buyableEffect("ex", 21));
	if (tmp.l.effect[3]) eff = eff.mul(tmp.l.effect[3]);
	return eff;
};

addLayer("ex", {
	name: "Expansion",
	symbol: "EX",
	position: 2,
	branches: ["cb", "a", "d"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		influenceUnlocked: false,
		influence: new Decimal(0),
		extra: [],
	}},
	color: "#B44990",
	nodeStyle() {if (tmp.ex.canReset || player.ex.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #B44990, #E03330)"}},
	resource: "expansion points",
	row: 4,
	baseResource: "acclimation points",
	baseAmount() {return player.a.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (getBuyableAmount("d", 13).gte(tmp.d.buyables[13].purchaseLimit)) base -= tmp.d.buyables[13].completionEffect;
		if (challengeCompletions("ec", 11) >= 6 && challengeEffect("ec", 11)[5]) base -= challengeEffect("ec", 11)[5];
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Expand your influence for ",
	gainMult() {
		let mult = new Decimal(1);
		if (getGridData("w", 102)) mult = mult.div(gridEffect("w", 102));
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		return mult;
	},
	effect() {
		let eff = [
			new Decimal(5).pow(player.ex.points),
			new Decimal(10).pow(player.ex.points),
			player.ex.points.mul(player.ex.points.gte(3) ? 300 : 100),
			new Decimal(1e25).pow(player.ex.influence.pow(0.25)),
			(hasMilestone("d", 40) ? player.ex.influence.add(1).pow(0.05) : player.ex.influence.add(1).log10().add(1).pow(hasMilestone("d", 33) ? 4.255 : 1)),
			(hasMilestone("d", 34) ? player.ex.influence.add(1).log10().add(1).pow(hasMilestone("d", 35) ? 0.5 : 0.2) : new Decimal(1)),
		];
		if (eff[3].gte("1e11111")) eff[3] = eff[3].div("1e11111").pow(1/9).mul("1e11111");
		if (eff[3].gte("1e22222")) eff[3] = eff[3].div("1e22222").pow(2/9).mul("1e22222");
		if (eff[3].gte("1e33333")) eff[3] = eff[3].div("1e33333").pow(1/3).mul("1e33333");
		if (eff[3].gte("1e44444")) eff[3] = eff[3].div("1e44444").pow(4/9).mul("1e44444");
		if (eff[3].gte("1e55555")) eff[3] = eff[3].div("1e55555").pow(5/9).mul("1e55555");
		if (eff[3].gte("1e66666")) eff[3] = eff[3].div("1e66666").pow(2/3).mul("1e66666");
		if (eff[3].gte("1e77777")) eff[3] = eff[3].div("1e77777").pow(7/9).mul("1e77777");
		if (eff[3].gte("1e88888")) eff[3] = eff[3].div("1e88888").pow(8/9).mul("1e88888");
		if (eff[3].gte("1e200000")) eff[3] = eff[3].div("1e200000").pow(0.0055).mul("1e200000");
		if (eff[3].gte("1e500000")) eff[3] = eff[3].div("1e500000").pow(0.01).mul("1e500000");
		if (eff[3].gte("1e1000000")) eff[3] = eff[3].div("1e1000000").log10().pow(10000).mul("1e1000000");
		if (eff[3].gte("1e5555555")) eff[3] = eff[3].div("1e5555555").pow(5/9).mul("1e5555555");
		return eff;
	},
	effectDescription() {return "which are dividing the conscious being requirement by /" + format(tmp.ex.effect[0]) + ", dividing the domination requirement by /" + format(tmp.ex.effect[1]) + ", and giving " + formatWhole(tmp.ex.effect[2]) + " extra CRA, FER, ANA, and SOV"},
	tabFormat() {
		let text = "After expanding 1 time, you keep acclimation enhancements on all resets,<br>acclimation resets (without respec) no longer reset anything,<br>and you automatically claim potential acclimation points.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.ex.points.gte(2)) text += "<br><br>After expanding 3 times, the last expansion effect is improved.";
		if (player.ex.points.gte(5)) text += "<br>After expanding 6 times, you bulk 10x stats from rows 3 and below.";
		if (player.ex.points.gte(8)) text += "<br>After expanding 9 times, you bulk 10x more stats from rows 3 and below.";
		if (player.ex.influenceUnlocked) {
			text += "<br><br>You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + format(player.ex.influence) + "</h2> influence, which divides the acclimation requirement by /" + format(tmp.ex.effect[3]);
			if (hasMilestone("d", 34)) text += ", divides the conscious being and domination requirements by /" + format(tmp.ex.effect[4]) + ", and divides the revolution requirement by /" + format(tmp.ex.effect[5]);
			else text += " and divides the conscious being and domination requirements by /" + format(tmp.ex.effect[4]);
			text += "<br><br>By default, influence generators max out at 100 seconds of production.";
		};
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.ex.influenceUnlocked) {
			arr.push(["buyables", "2"], "blank");
			for (const key in tmp.ex.buyables)
				if (Object.hasOwnProperty.call(tmp.ex.buyables, key) && key < 20 && tmp.ex.buyables[key].unlocked)
					arr.push(["buyable", +key], "blank");
			arr.push(["buyables", "3"], "blank");
		};
		return arr;
	},
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.ex.unlocked},
	hotkeys: [{
		key: "x",
		description: "X: reset for expansion points",
		onPress() {if (player.ex.unlocked) doReset("ex")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("ex", keep);
		for (const key in layers.ex.buyables)
			if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20)
				player.ex.extra[key - 11] = new Decimal(0);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 7 && !player.ex.influenceUnlocked) player.ex.influenceUnlocked = true;
		if (player.ex.influenceUnlocked) {
			diff *= buyableEffect("ex", 31);
			for (const key in layers.ex.buyables) {
				if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20 && hasBuyable("ex", key) && tmp.ex.buyables[key].unlocked) {
					let eff = buyableEffect("ex", key);
					if (key == 11) player.ex.influence = player.ex.influence.add(eff.mul(diff)).min(eff.mul(100));
					else player.ex.extra[key - 12] = player.ex.extra[key - 12].add(eff.mul(diff)).min(eff.mul(100));
				};
			};
		};
	},
	shouldNotify() {
		if (player.ex.influenceUnlocked)
			for (const key in tmp.ex.buyables)
				if (tmp.ex.buyables[key]?.unlocked && tmp.ex.buyables[key]?.canAfford) return true;
	},
	componentStyles: {
		"prestige-button"() {if (tmp.ex.canReset && tmp.ex.nodeStyle) return tmp.ex.nodeStyle},
		"buyable"() {return {"width": "500px", "height": "60px", "border-radius": "0px"}},
	},
	buyables: {
		11: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "1st influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " influence per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		12: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "2nd influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " 1st influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		13: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "3rd influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " 2nd influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		14: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "4th influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " 3rd influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedGenerators() >= 1},
		},
		15: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "5th influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " 4th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedGenerators() >= 2},
		},
		16: {
			cost() {return getGeneratorCost(this.id)},
			effect() {return getGeneratorEffect(this.id)},
			title: "6th influence generator",
			display() {return "these generators are producing " + format(this.effect()) + " 5th influence generators per second<br><br><div style='display: flex'><div>Req: " + formatWhole(this.cost()) + " expansion points</div><div>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "") + "</div></div>"},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
			unlocked() {return getUnlockedGenerators() >= 3},
		},
		21: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id).add(1);
				if (hasMilestone("r", 8)) amt = amt.sub(1);
				return new Decimal(10).pow(amt.pow(challengeCompletions("ec", 11) >= 8 ? 1.5 : 2));
			},
			effectBase() {
				let base = new Decimal(2);
				base = base.add(buyableEffect("ex", 22));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).pow_base(this.effectBase())},
			title: "Influence tickspeed",
			display() {return "all generators produce " + format(this.effectBase()) + " times as much<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + format(this.cost()) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {"width": "250px", "height": "100px", "border-radius": "25px"};
				if (this.canAfford()) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
		22: {
			cost() {return new Decimal(1e12).pow(getBuyableAmount(this.layer, this.id).add(1).pow(getGridData("w", 302) ? 1.5 : 2))},
			effectBase() {return 0.5},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase())},
			title: "Influence empowerment",
			display() {return "each tickspeed gives " + format(this.effectBase()) + " more multiplier<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + format(this.cost()) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {"width": "250px", "height": "100px", "border-radius": "25px"};
				if (this.canAfford()) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
		31: {
			cost() {return new Decimal([7.7e77, 1.11e111, 2.02e202, "3.45e345", "6.6e660", "1.055e1055"][getBuyableAmount(this.layer, this.id)] || Infinity)},
			effect() {return getBuyableAmount(this.layer, this.id).toNumber() + 1},
			title: "Generator improvement",
			display() {
				let amt = getBuyableAmount(this.layer, this.id).toNumber();
				return "improve the generator formulas and time for generators goes faster, but reset influence and all non-bought generators<br><br>Next: " + GENERATOR_IMPROVEMENTS[amt] + " --> " + (GENERATOR_IMPROVEMENTS[amt + 1] || "???") + " and " + this.effect() + "x --> " + (this.effect() + 1) + "x<br><br>Cost: " + format(this.cost()) + " influence<br><br>Bought: " + formatWhole(amt);
			},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = new Decimal(0);
				for (const key in layers.ex.buyables)
					if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20)
						player.ex.extra[key - 11] = new Decimal(0);
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {"width": "400px", "height": "110px", "border-radius": "25px"};
				if (this.canAfford()) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
	},
});
