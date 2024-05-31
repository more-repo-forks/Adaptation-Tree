addLayer("d", {
	name: "Domination",
	symbol: "D",
	position: 2,
	branches: ["a"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
		unlocks: [],
	}},
	color: "#E03330",
	resource: "domination points",
	row: 3,
	baseResource: "acclimation points",
	baseAmount() {return player.a.points},
	requires: new Decimal(250),
	type: "static",
	base() {
		if (hasChallenge("sp", 19)) return 1.84;
		return 2;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.ec.unlocked},
	resetDescription: "Dominate for ",
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("a", 69)) mult = mult.div(milestoneEffect("a", 69));
		if (hasMilestone("a", 71)) mult = mult.div(milestoneEffect("a", 71));
		if (hasChallenge("sp", 17)) mult = mult.div(challengeEffect("sp", 17));
		if (hasChallenge("sp", 21) && challengeEffect("sp", 21)[4]) mult = mult.div(challengeEffect("sp", 21)[4]);
		if (player.d.unlocks[3]) mult = mult.div(buyableEffect("d", 14));
		return mult;
	},
	effect() {return player.points.add(1).pow(0.025)},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "You keep all acclimation enhancements on domination resets.<br><br>After dominating 1 time, you automatically claim potential evolutions,<br>evolution resets (that are not in retrogressions) no longer reset anything,<br>and power gain is multiplied by your current power plus 1 exponentiated by 0.025.<br><br>The above extra effects will not go away even if this layer is reset."],
		"blank",
		["row", [
			["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
			["display-text", () => {
				let max = getBuyableAmount("d", 11).add(tmp.d.buyables[11].extra).max(getBuyableAmount("d", 12).add(tmp.d.buyables[12].extra)).max(getBuyableAmount("d", 13).add(tmp.d.buyables[13].extra)).max(getBuyableAmount("d", 14).add(tmp.d.buyables[14].extra)).toNumber() + 1;
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
					getBuyableAmount("d", 11).toNumber() + 1,
					getBuyableAmount("d", 13).toNumber() + 1,
					getBuyableAmount("d", 14).toNumber() + 1,
					getBuyableAmount("d", 12).toNumber() + 1,
				];
				let statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				let statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				// extra stats
				stats[0] += tmp.d.buyables[11].extra.toNumber();
				stats[1] += tmp.d.buyables[13].extra.toNumber();
				stats[2] += tmp.d.buyables[14].extra.toNumber();
				stats[3] += tmp.d.buyables[12].extra.toNumber();
				statPoint0 = 50 - (stats[0] / max * 45 - 0.5);
				statPoint2 = 50 + (stats[2] / max * 45 - 0.5);
				text += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + (stats[1] / max * 45 - 0.5)) + "," + (50 - (stats[1] / max * 45 - 0.5)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - (stats[3] / max * 45 - 0.5)) + "," + (50 + (stats[3] / max * 45 - 0.5)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
				// return
				return text + "</svg>";
			}],
			["column", [["buyable", 13], ["blank", "75px"], ["buyable", 14]]],
		]],
		"blank",
		"respec-button",
		"blank",
		"milestones",
	],
	layerShown() {return hasChallenge("sp", 15) || player.d.unlocked},
	hotkeys: [{
		key: "d",
		description: "D: reset for domination points",
		onPress() {if (player.d.unlocked) doReset("d")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("d", keep);
	},
	update(diff) {
		if (!player.d.unlocks[0] && player.cb.points.gte(11)) player.d.unlocks[0] = true;
		if (!player.d.unlocks[1] && player.sp.points.gte(14)) player.d.unlocks[1] = true;
		if (!player.d.unlocks[2] && player.a.points.gte(270)) player.d.unlocks[2] = true;
		if (!player.d.unlocks[3] && player.cb.points.gte(12) && player.sp.points.gte(16) && player.a.points.gte(325) && player.d.points.gte(1)) player.d.unlocks[3] = true;
	},
	componentStyles: {
		"buyable"() {return {'width': '210px', 'height': '110px'}},
	},
	buyables: {
		11: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("d", 0)) base = base.mul(milestoneEffect("d", 0));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "DOMINATE (FOC)US",
			display() {
				if (!player.d.unlocks[0]) return "<br>requires 11 conscious beings to unlock";
				if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return "Normal effect: divides focus requirement by " + format(this.effect()) + "<br><br>Complete domination effect: decreases the focus requirement base by 0.15<br><br>Progress: " + format(100) + "%";
				return "divide focus requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 20) + "%";
			},
			purchaseLimit: 5,
			canAfford() {return player.d.unlocks[0] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra: new Decimal(0),
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		12: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(1.2);
				if (hasMilestone("d", 3)) base = base.mul(milestoneEffect("d", 3));
				if (hasMilestone("d", 5)) base = base.mul(milestoneEffect("d", 5));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "DOMINATE (SPE)CIES",
			display() {
				if (!player.d.unlocks[1]) return "<br>requires 14 species to unlock";
				return "divide species requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 10) + "%";
			},
			purchaseLimit: 10,
			canAfford() {return player.d.unlocks[1] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra: new Decimal(0),
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		13: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(1000);
				if (hasMilestone("d", 1)) base = base.mul(milestoneEffect("d", 1));
				if (hasMilestone("d", 6)) base = base.mul(milestoneEffect("d", 6));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "DOMINATE (CLI)MATE",
			display() {
				if (!player.d.unlocks[2]) return "<br>requires 270 acclimation points to unlock";
				return "divide acclimation requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 20 / 3) + "%";
			},
			purchaseLimit: 15,
			canAfford() {return player.d.unlocks[2] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra: new Decimal(0),
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("d", 2)) base = base.mul(milestoneEffect("d", 2));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id))},
			title: "TOTAL (DOM)INATION",
			display() {
				if (!player.d.unlocks[3]) return "<br>requires 12 conscious beings, 16 species, 325 acclimation points, and 1 domination point to unlock";
				return "divide domination requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " domination points<br><br>Progress: " + format(getBuyableAmount(this.layer, this.id) * 5) + "%";
			},
			purchaseLimit: 20,
			canAfford() {return player.d.unlocks[3] && player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra: new Decimal(0),
			style() {if (getBuyableAmount(this.layer, this.id).gte(this.purchaseLimit)) return {"border-color": "#E03330"}},
		},
		respec() {
			setBuyableAmount("d", 11, new Decimal(0));
			setBuyableAmount("d", 12, new Decimal(0));
			setBuyableAmount("d", 13, new Decimal(0));
			setBuyableAmount("d", 14, new Decimal(0));
			player.d.spent = new Decimal(0);
			setClickableState("cb", 11, 0);
			setClickableState("cb", 12, 0);
			doReset("d", true, true);
		},
		respecText: "respec domination points",
	},
	milestones: {
		0: {
			requirement: 5,
			requirementDescription: "FOC enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1)},
			effectDescription() {return "multiply the base effect of FOC based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
		},
		1: {
			requirement: 8,
			requirementDescription: "CLI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(3)},
			effectDescription() {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		2: {
			requirement: 9,
			requirementDescription: "DOM enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.0252)},
			effectDescription() {return "multiply the base effect of DOM based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		3: {
			requirement: 12,
			requirementDescription: "SPE enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.031)},
			effectDescription() {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		4: {
			requirement: 13,
			requirementDescription: "Species enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.242)},
			effectDescription() {return "divide species requirement based on domination points<br>Effect: /" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1) || player.ec.unlocked},
		},
		5: {
			requirement: 14,
			requirementDescription: "SPE enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of SPE based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1)},
		},
		6: {
			requirement: 17,
			requirementDescription: "CLI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.d.points.add(1).pow(7)},
			effectDescription() {return "multiply the base effect of CLI based on domination points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " domination points"},
			done() {return player.d.points.gte(this.requirement)},
			unlocked() {return hasMilestone("d", this.id - 1)},
		},
	},
});
