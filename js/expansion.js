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
	color: "#B3478F",
	nodeStyle() {if (tmp.ex.canReset || player.ex.unlocked) return {"background": "border-box linear-gradient(to right, #EE7770, #B3478F, #E03330)"}},
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
		return mult;
	},
	effect() {
		let eff = [
			new Decimal(5).pow(player.ex.points),
			new Decimal(10).pow(player.ex.points),
			player.ex.points.mul(player.ex.points.gte(3) ? 300 : 100),
			new Decimal(1e25).pow(player.ex.influence.pow(0.25)),
			player.ex.influence.add(1).log10().add(1),
		];
		if (eff[3].gte("1e11111")) eff[3] = eff[3].div("1e11111").pow(1/9).mul("1e11111");
		return eff;
	},
	effectDescription() {return "which are dividing the conscious being requirement by /" + format(tmp.ex.effect[0]) + ", dividing domination requirement by /" + format(tmp.ex.effect[1]) + ", and giving " + formatWhole(tmp.ex.effect[2]) + " extra CRA, FER, ANA, and SOV"},
	tabFormat() {
		let text = "After expanding 1 time, you keep acclimation enhancements on all resets,<br>acclimation resets (without respec) no longer reset anything,<br>and you automatically claim potential acclimation points.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.ex.points.gte(2)) text += "<br><br>After expanding 3 times, the last expansion effect is improved.";
		if (player.ex.points.gte(5)) text += "<br>After expanding 6 times, you bulk 10x stats from rows 3 and below.";
		if (player.ex.influenceUnlocked) text += "<br><br>You have <h2 style='color: #B3478F; text-shadow: #B3478F 0px 0px 10px'>" + format(player.ex.influence) + "</h2> influence, which divides the acclimation requirement by /" + format(tmp.ex.effect[3]) + " and divides the conscious being and domination requirements by /" + format(tmp.ex.effect[4]);
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.ex.influenceUnlocked) {
			for (const key in layers.ex.buyables) {
				if (Object.hasOwnProperty.call(layers.ex.buyables, key) && key < 20) {
					arr.push(["buyable", +key], "blank");
				};
			};
			arr.push(["buyables", "2"], "blank");
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
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("ex", keep);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 7 && !player.ex.influenceUnlocked) player.ex.influenceUnlocked = true;
		if (player.ex.influenceUnlocked) {
			if (hasBuyable("ex", 11)) player.ex.influence = player.ex.influence.add(buyableEffect("ex", 11).mul(diff)).min(buyableEffect("ex", 11).mul(100));
			if (hasBuyable("ex", 12)) player.ex.extra[0] = player.ex.extra[0].add(buyableEffect("ex", 12).mul(diff)).min(buyableEffect("ex", 12).mul(100));
			if (hasBuyable("ex", 13)) player.ex.extra[1] = player.ex.extra[1].add(buyableEffect("ex", 13).mul(diff)).min(buyableEffect("ex", 13).mul(100));
		};
	},
	shouldNotify() {
		if (player.ex.influenceUnlocked) {
			for (const key in tmp.ex.buyables) {
				if (tmp.ex.buyables[key]?.canAfford) return true;
			};
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.ex.canReset && tmp.ex.nodeStyle) return tmp.ex.nodeStyle},
		"buyable"() {return {"width": "500px", "height": "100px", "border-radius": "50px"}},
	},
	buyables: {
		11: {
			cost() {
				if (challengeCompletions("ec", 11) >= 8) return getBuyableAmount(this.layer, this.id).mul(2);
				return new Decimal(2).pow(getBuyableAmount(this.layer, this.id));
			},
			effectBase() {
				let base = getBuyableAmount(this.layer, this.id);
				base = base.mul(buyableEffect("ex", 21));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase()).mul(getBuyableAmount(this.layer, this.id).add(player[this.layer].extra[this.id - 11].floor()))},
			title: "1st influence generator",
			display() {return "each generator produces " + format(this.effectBase()) + " influence per second (maxes at 100s)<br><br>Effect: " + format(this.effect()) + "/sec<br><br>Req: " + formatWhole(this.cost()) + " expansion points<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "")},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		12: {
			cost() {
				if (challengeCompletions("ec", 11) >= 8) return getBuyableAmount(this.layer, this.id).add(1).mul(3);
				return new Decimal(3).pow(getBuyableAmount(this.layer, this.id).add(1));
			},
			effectBase() {
				let base = getBuyableAmount(this.layer, this.id);
				base = base.mul(buyableEffect("ex", 21));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase()).mul(getBuyableAmount(this.layer, this.id).add(player[this.layer].extra[this.id - 11].floor()))},
			title: "2nd influence generator",
			display() {return "each generator produces " + format(this.effectBase()) + " 1st influence generators per second (maxes at 100s)<br><br>Effect: " + format(this.effect()) + "/sec<br><br>Req: " + formatWhole(this.cost()) + " expansion points<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "")},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		13: {
			cost() {
				if (challengeCompletions("ec", 11) >= 8) return getBuyableAmount(this.layer, this.id).add(1).mul(5);
				return new Decimal(5).pow(getBuyableAmount(this.layer, this.id).add(1));
			},
			effectBase() {
				let base = getBuyableAmount(this.layer, this.id);
				base = base.mul(buyableEffect("ex", 21));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase()).mul(getBuyableAmount(this.layer, this.id).add(player[this.layer].extra[this.id - 11].floor()))},
			title: "3rd influence generator",
			display() {return "each generator produces " + format(this.effectBase()) + " 2nd influence generators per second (maxes at 100s)<br><br>Effect: " + format(this.effect()) + "/sec<br><br>Req: " + formatWhole(this.cost()) + " expansion points<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (player[this.layer].extra[this.id - 11].gte(1) ? " + " + formatWhole(player[this.layer].extra[this.id - 11].floor()) : "")},
			canAfford() {return player.ex.influenceUnlocked && player[this.layer].points.gte(this.cost())},
			buy() {addBuyables(this.layer, this.id, 1)},
			style() {if (this.canAfford()) return tmp.ex.nodeStyle},
		},
		21: {
			cost() {
				if (challengeCompletions("ec", 11) >= 8) return new Decimal(10).pow(getBuyableAmount(this.layer, this.id).add(1).pow(1.5));
				return new Decimal(10).pow(getBuyableAmount(this.layer, this.id).add(1).pow(2));
			},
			effectBase() {
				let base = new Decimal(2);
				base = base.add(buyableEffect("ex", 22));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "Influence tickspeed",
			display() {return "all generators produce " + format(this.effectBase()) + " times as much<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {"width": "250px", "border-radius": "25px"};
				if (this.canAfford()) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
		22: {
			cost() {return new Decimal(1e12).pow(getBuyableAmount(this.layer, this.id).add(1).pow(2))},
			effectBase() {return 0.5},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase())},
			title: "Influence empowerment",
			display() {return "each tickspeed gives " + format(this.effectBase()) + " more multiplier<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " influence<br><br>Bought: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ex.influenceUnlocked && player.ex.influence.gte(this.cost())},
			buy() {
				player.ex.influence = player.ex.influence.sub(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			style() {
				let obj = {"width": "250px", "border-radius": "25px"};
				if (this.canAfford()) obj.background = tmp.ex.nodeStyle.background;
				return obj;
			},
		},
	},
});

addNode("blank", {
	symbol: "W",
	branches: ["d"],
	position: 3,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked: "coming soon!",
	row: 4,
	layerShown() {return challengeCompletions("ec", 11) >= 2},
});
