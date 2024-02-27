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
	base() {
		let base = 2;
		if (hasMilestone("g", 67)) base -= milestoneEffect("g", 67);
		if (hasMilestone("g", 72)) base -= milestoneEffect("g", 72);
		return base;
	},
	exponent: 1,
	canBuyMax() {return player.cb.unlocked},
	resetDescription: "Acclimate for ",
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("g", 48)) mult = mult.div(milestoneEffect("g", 48));
		if (hasMilestone("g", 52)) mult = mult.div(milestoneEffect("g", 52));
		if (hasMilestone("g", 60)) mult = mult.div(milestoneEffect("g", 60));
		if (player.e.points.gte(26)) mult = mult.div(1.0915);
		if (player.e.points.gte(83)) mult = mult.div(2.66155);
		if (player.e.points.gte(155)) mult = mult.div(4);
		if (player.e.points.gte(397)) mult = mult.div(2);
		if (player.e.points.gte(728)) mult = mult.div(1.5);
		if (player.e.points.gte(1306)) mult = mult.div(10);
		if (hasChallenge("e", 16)) mult = mult.div(challengeEffect("e", 16));
		if (hasChallenge("e", 17)) mult = mult.div(challengeEffect("e", 17));
		if (hasChallenge("sp", 11)) mult = mult.div(challengeEffect("sp", 11));
		if (player.a.unlocked) mult = mult.div(buyableEffect("a", 13));
		if (tmp.cb.effect[1]) mult = mult.div(tmp.cb.effect[1]);
		return mult;
	},
	effect() {
		let amt = player.a.population;
		amt = amt.mul(buyableEffect("a", 14));
		let mult = [1, 1, 1];
		if (hasMilestone("a", 3)) mult[2] *= milestoneEffect("a", 3);
		if (hasMilestone("a", 11)) mult[1] *= milestoneEffect("a", 11);
		if (hasMilestone("a", 17)) mult[2] *= milestoneEffect("a", 17);
		if (hasMilestone("a", 25)) {
			mult[1] *= milestoneEffect("a", 25);
			mult[2] *= milestoneEffect("a", 25);
		};
		if (hasMilestone("a", 31)) mult[0] *= milestoneEffect("a", 31);
		if (hasMilestone("a", 40)) mult[0] *= milestoneEffect("a", 40);
		if (hasMilestone("a", 41)) mult[2] *= milestoneEffect("a", 41);
		if (hasMilestone("a", 45)) mult[0] *= milestoneEffect("a", 45);
		if (hasChallenge("e", 18)) mult[2] *= challengeEffect("e", 18);
		if (hasChallenge("e", 19)) mult[0] *= 100;
		let exp1 = 0.1;
		if (hasMilestone("a", 34)) exp1 += milestoneEffect("a", 34);
		let eff = [
			(hasMilestone("a", 6) ? amt.add(1).pow(amt.log10().add(1).pow(0.125).mul(200000).mul(mult[0])) : new Decimal(10).pow(amt.sub(1).mul(mult[0])).sub(1).mul(1e100).add(1)),
			amt.pow(exp1).mul(mult[1]),
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
		if (hasChallenge("e", 21) && challengeEffect("e", 21)[1]) max = max.mul(challengeEffect("e", 21)[1]);
		if (player.cb.focusUnlocked) max = max.mul(clickableEffect("cb", 12));
		player.a.populationMax = max;
		// calculate rate
		let rate = new Decimal(player.a.populationTime).mul(2).div(max.pow(0.5));
		rate = rate.mul(buyableEffect("a", 12));
		if (player.cb.focusUnlocked) rate = rate.mul(clickableEffect("cb", 12));
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
				if (hasMilestone("a", 26)) base = base.mul(milestoneEffect("a", 26));
				if (hasMilestone("a", 37)) base = base.mul(milestoneEffect("a", 37));
				if (hasMilestone("a", 46)) base = base.mul(milestoneEffect("a", 46));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(CRA)FTSMANSHIP",
			display() {return "multiply population maximum by " + format(this.effectBase()) + "<br>(population max also influences gain)<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("sp", 11)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 7)) extra = extra.add(milestoneEffect("a", 7));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				if (hasMilestone("a", 43)) extra = extra.add(milestoneEffect("a", 43));
				return extra.floor();
			},
		},
		12: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(5);
				if (hasMilestone("a", 15)) base = base.mul(milestoneEffect("a", 15));
				if (hasMilestone("a", 30)) base = base.mul(milestoneEffect("a", 30));
				if (hasMilestone("a", 35)) base = base.mul(milestoneEffect("a", 35));
				if (hasMilestone("a", 48)) base = base.mul(milestoneEffect("a", 48));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(FER)TILITY",
			display() {return "multiply population gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("sp", 11)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 4)) extra = extra.add(milestoneEffect("a", 4));
				if (hasMilestone("a", 9)) extra = extra.add(milestoneEffect("a", 9));
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				if (hasMilestone("a", 43)) extra = extra.add(milestoneEffect("a", 43));
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
				if (hasMilestone("a", 28)) base = base.add(milestoneEffect("a", 28));
				if (hasMilestone("a", 38)) base = base.add(milestoneEffect("a", 38));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(ANA)LYTICITY",
			display() {return "divide acclimation requirement by " + format(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("sp", 12)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 22)) extra = extra.add(milestoneEffect("a", 22));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				if (hasMilestone("a", 43)) extra = extra.add(milestoneEffect("a", 43));
				return extra.floor();
			},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1)},
			effectBase() {
				let base = new Decimal(3);
				if (hasMilestone("a", 2)) base = base.mul(milestoneEffect("a", 2));
				if (hasMilestone("a", 14)) base = base.mul(milestoneEffect("a", 14));
				if (hasMilestone("a", 27)) base = base.mul(milestoneEffect("a", 27));
				if (hasMilestone("a", 36)) base = base.mul(milestoneEffect("a", 36));
				if (hasMilestone("a", 47)) base = base.mul(milestoneEffect("a", 47));
				return base;
			},
			effect() {return new Decimal(this.effectBase()).pow(getBuyableAmount(this.layer, this.id).add(this.extra()))},
			title: "(SOV)EREIGNTY",
			display() {return "multiply population amount in population effects by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " acclimation points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && !inChallenge("sp", 11)},
			buy() {
				player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, 1);
			},
			extra() {
				let extra = new Decimal(0);
				if (hasMilestone("a", 6)) extra = extra.add(milestoneEffect("a", 6));
				if (hasMilestone("a", 18)) extra = extra.add(milestoneEffect("a", 18));
				if (hasMilestone("a", 20)) extra = extra.add(milestoneEffect("a", 20));
				if (hasMilestone("a", 24)) extra = extra.add(milestoneEffect("a", 24));
				if (hasMilestone("a", 43)) extra = extra.add(milestoneEffect("a", 43));
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
			effectDescription() {
				let text = "unlock the 6th retrogression";
				if (hasMilestone("a", this.id) || hasChallenge("e", 16)) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " acclimation points";
				return text;
			},
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
		14: {
			requirement: 26,
			requirementDescription: "SOV enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(10).add(1).pow(0.2525)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		15: {
			requirement: 28,
			requirementDescription: "FER enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.32)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		16: {
			requirement: 32,
			requirementDescription: "Retrogression enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.036).sub(1)},
			effectDescription() {return "increase the base of the 7th retrogression's last effect based on acclimation points<br>Effect: +" + format(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		17: {
			requirement: 34,
			requirementDescription: "Population enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.66)},
			effectDescription() {return "multiply the last population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		18: {
			requirement: 35,
			requirementDescription: "CRA enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 11).div(2).floor();
				return getBuyableAmount("a", 11).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of CRA give an extra level to FER, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		19: {
			requirement: 37,
			requirementDescription: "Retrogression enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.23},
			effectDescription() {return "increase the exponent of the 6th retrogression's last effect by 0.23<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		20: {
			requirement: 40,
			requirementDescription: "ANA enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 13).div(2).floor();
				return getBuyableAmount("a", 13).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of ANA give an extra level to CRA, FER, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		21: {
			requirement: 43,
			requirementDescription: "Retrogression enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.75},
			effectDescription() {return "increase the exponent of the 8th retrogression's last effect by 0.75<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		22: {
			requirement: 46,
			requirementDescription: "SOV enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 14).div(2).floor();
				return getBuyableAmount("a", 14).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of SOV give an extra level to CRA, FER, and ANA<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		23: {
			requirement: 49,
			requirementDescription: "Retrogression enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.474},
			effectDescription() {return "increase the exponent of the 9th retrogression's last effect by 0.474<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		24: {
			requirement: 50,
			requirementDescription: "FER enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {
				if (hasMilestone("a", 32)) return getBuyableAmount("a", 12).div(2).floor();
				return getBuyableAmount("a", 12).div(3).floor();
			},
			effectDescription() {return "every " + (hasMilestone("a", 32) ? 2 : 3) + " base levels of FER give an extra level to CRA, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		25: {
			requirement: 53,
			requirementDescription: "Population enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.2758664)},
			effectDescription() {return "multiply the last two population effects based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		26: {
			requirement: 57,
			requirementDescription: "CRA enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		27: {
			requirement: 60,
			requirementDescription: "SOV enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		28: {
			requirement: 64,
			requirementDescription: "ANA enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.2},
			effectDescription() {return "increase the base effect of ANA by 0.2<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		29: {
			requirement: 67,
			requirementDescription: "Retrogression enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 2<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		30: {
			requirement: 69,
			requirementDescription: "FER enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.095)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		31: {
			requirement: 70,
			requirementDescription: "Population enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.mul(2).add(1).pow(0.88477)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		32: {
			requirement: 74,
			requirementDescription: "Synergy enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "decrease the base levels of CRA, FER, ANA, and SOV required<br>to give extra levels to the other stats by 1 (from 3 to 2)<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		33: {
			requirement: 80,
			requirementDescription: "Retrogression enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 8<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		34: {
			requirement: 84,
			requirementDescription: "Population enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.025},
			effectDescription() {return "increase the exponent of the second population effect by 0.025<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		35: {
			requirement: 88,
			requirementDescription: "FER enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.145)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		36: {
			requirement: 90,
			requirementDescription: "SOV enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1048)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		37: {
			requirement: 96,
			requirementDescription: "CRA enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.105)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		38: {
			requirement: 99,
			requirementDescription: "ANA enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.3},
			effectDescription() {return "increase the base effect of ANA by 0.3<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		39: {
			requirement: 105,
			requirementDescription: "Conscious enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.cb.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " acclimation points and 22 completions of the 10th retrogression";
				return text;
			},
			done() {return player.a.points.gte(this.requirement) && challengeCompletions("e", 21) >= 22},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		40: {
			requirement: 114,
			requirementDescription: "Population enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1.033333333333333).pow(player.a.points)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		41: {
			requirement: 122,
			requirementDescription: "Population enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal(1.15).pow(player.a.points.pow(0.5))},
			effectDescription() {return "multiply the last population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		42: {
			requirement: 128,
			requirementDescription: "Retrogression enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the completion limit of the 10th retrogression by 8<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		43: {
			requirement: 135,
			requirementDescription: "Synergy enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("a", 11).min(getBuyableAmount("a", 12)).min(getBuyableAmount("a", 13)).min(getBuyableAmount("a", 14)).div(4).floor()},
			effectDescription() {return "every 4 base levels of CRA, FER, ANA, and SOV give an extra level to CRA, FER, ANA, and SOV<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		44: {
			requirement: 146,
			requirementDescription: "Retrogression enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 15},
			effectDescription() {return "increase the base of the 10th retrogression's first effect by 15<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		45: {
			requirement: 150,
			requirementDescription: "Population enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.925)},
			effectDescription() {return "multiply the exponent of the first population effect based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		46: {
			requirement: 159,
			requirementDescription: "CRA enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of CRA based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		47: {
			requirement: 166,
			requirementDescription: "SOV enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of SOV based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
		48: {
			requirement: 173,
			requirementDescription: "FER enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.a.points.add(1).pow(0.05)},
			effectDescription() {return "multiply the base effect of FER based on acclimation points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " acclimation points"},
			done() {return player.a.points.gte(this.requirement)},
			unlocked() {return hasMilestone("a", this.id - 1)},
		},
	},
});
