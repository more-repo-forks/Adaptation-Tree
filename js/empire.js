addLayer("em", {
	name: "Empire",
	symbol: "EM",
	position: 1,
	branches: ["l", "ex", "t"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: 0,
	}},
	color: "#B44990",
	nodeStyle() {if (tmp.em.canReset || player.em.unlocked) return {"background": "border-box linear-gradient(to right, #55B020, #B44990, #C77055)"}},
	resource: "empires",
	row: 6,
	baseResource: "expansion points",
	baseAmount() {return player.ex.points},
	requires: new Decimal(500),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Imperialize for ",
	gainMult() {
		let mult = new Decimal(1);
		if (tmp.em.effect[3]) mult = mult.div(tmp.em.effect[3]);
		return mult;
	},
	effect() { return [
		player.em.points.mul(hasMilestone("em", 1) ? 2 : 1),
		player.em.points.div(10).add(1),
		player.em.points.mul(2),
		new Decimal(player.em.milestones.length + 1).pow(0.171),
	]},
	effectDescription() {return "which are increasing leader and territory amounts in their effects by +" + formatWhole(tmp.em.effect[0]) + " and directly multiplying expansion point gain by " + format(tmp.em.effect[1]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "After consolidating 1 time, you keep domination enhancements on all resets.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
		["microtabs", "features"],
		"blank",
	],
	layerShown() {return hasMilestone("d", 59) || player.em.unlocked},
	hotkeys: [{
		key: "m",
		description: "M: reset for empires",
		onPress() {if (player.em.unlocked) doReset("em")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("em", keep);
	},
	componentStyles: {
		"prestige-button"() {if (tmp.em.canReset && tmp.em.nodeStyle) return tmp.em.nodeStyle},
		"microtabs"() {return {"box-sizing": "border-box", "width": "fit-content", "max-width": "calc(100% - 34px)", "border": "2px solid #B44990", "padding": "8.5px"}},
		"tab-button"() {return {"margin": "8.5px"}},
		"buyable"() {return {"width": "210px", "height": "110px"}},
	},
	microtabs: {
		features: {
			"Aspects": {
				content() {
					if (player.em.points.lt(1)) return [["display-text", "LOCKED"]];
					let max = getBuyableAmount("em", 11).max(getBuyableAmount("em", 12)).max(getBuyableAmount("em", 13)).max(getBuyableAmount("em", 14)).toNumber() + 1;
					if (max < 2) max = 2;
					let statText = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
					statText += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
					statText += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
					let rectMax = max;
					if (rectMax >= 16) rectMax = max / (2 ** Math.floor(Math.log2(max) - 3));
					for (let index = 0; index < rectMax; index++) {
						let low = Math.min((index / rectMax * 45) + 5.5, 50);
						let high = Math.max(((rectMax - index) / rectMax * 90) - 1, 0);
						statText += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
					};
					let stats = [
						getBuyableAmount("em", 11).toNumber() + 1,
						getBuyableAmount("em", 13).toNumber() + 1,
						getBuyableAmount("em", 14).toNumber() + 1,
						getBuyableAmount("em", 12).toNumber() + 1,
					];
					let statPoint0 = 50 - Math.max(stats[0] / max * 45 - 0.5, 0);
					let statPoint2 = 50 + Math.max(stats[2] / max * 45 - 0.5, 0);
					statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1] / max * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1] / max * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3] / max * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3] / max * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
					statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1] / max * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1] / max * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3] / max * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3] / max * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
					return [
						["display-text", "You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(tmp.em.effect[2]) + "</h2> aspect points, of which " + formatWhole(tmp.em.effect[2].sub(player.em.spent)) + " are unspent<br><br>Buying an aspect costs 1 aspect point."],
						"blank",
						["row", [
							["column", [["buyable", 11], ["blank", "75px"], ["buyable", 12]]],
							["column", [["display-text", statText + "</svg>"]]],
							["column", [["buyable", 13], ["blank", "75px"], ["buyable", 14]]],
						]],
						"respec-button",
					];
				},
				style: {"margin": "8.5px"},
				unlocked() {return player.em.points.gte(1)},
			},
			"Phases": {
				content() {
					if (player.em.points.lt(2)) return [["display-text", "LOCKED"]];
					return [["display-text", "You have <h2 style='color: #B44990; text-shadow: #B44990 0px 0px 10px'>" + formatWhole(player.em.milestones.length) + "</h2> phases, which are dividing empire requirement by /" + format(tmp.em.effect[3])], "blank", "milestones"];
				},
				style: {"margin": "8.5px"},
				unlocked() {return player.em.points.gte(2)},
			},
		},
	},
	buyables: {
		11: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1).mul(hasMilestone("em", 6) ? 450 : 500)},
			effect() {
				let eff = getBuyableAmount(this.layer, this.id);
				if (hasMilestone("em", 2)) eff = eff.add(milestoneEffect("em", 2));
				return eff;
			},
			title: "(ECO)SYSTEM ASPECT",
			display() {return "unlock 1 more ANACHRONISM tier<br><br>Effect: +" + formatWhole(this.effect()) + "<br><br>Req: " + formatWhole(this.cost()) + " ecosystems<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ec.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
		},
		12: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1).mul(hasMilestone("em", 4) ? 450 : 500)},
			effectBase() {
				let base = 0.05;
				if (hasMilestone("em", 8)) base += milestoneEffect("em", 8);
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase())},
			title: "(REV)OLUTION ASPECT",
			display() {return "increase change gain exponent by " + format(this.effectBase()) + " (also influence limit)<br><br>Effect: +" + format(this.effect()) + "<br><br>Req: " + formatWhole(this.cost()) + " revolutions<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.r.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
		},
		13: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1).mul(hasMilestone("em", 9) ? 450 : 500)},
			effectBase() {
				let base = 0.1;
				if (hasMilestone("em", 0)) base += milestoneEffect("em", 0);
				if (hasMilestone("em", 7)) base += milestoneEffect("em", 7);
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase())},
			title: "(EXP)ANSION ASPECT",
			display() {return "increase influence gain exponent by " + format(this.effectBase()) + "<br><br>Effect: +" + format(this.effect()) + "<br><br>Req: " + formatWhole(this.cost()) + " expansion points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.ex.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
		},
		14: {
			cost() {return getBuyableAmount(this.layer, this.id).add(1).mul(hasMilestone("em", 9) ? 450 : 500)},
			effectBase() {
				let base = 2;
				if (hasMilestone("em", 3)) base += milestoneEffect("em", 3);
				if (hasMilestone("em", 5)) base += milestoneEffect("em", 5);
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).mul(this.effectBase())},
			title: "(WAR) ASPECT",
			display() {return "decrease the battle enhancement costs by " + formatWhole(this.effectBase()) + "<br><br>Effect: -" + formatWhole(this.effect()) + "<br><br>Req: " + formatWhole(this.cost()) + " wars<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id))},
			canAfford() {return player.w.points.gte(this.cost()) && tmp.em.effect[2].sub(player[this.layer].spent).gte(1)},
			buy() {
				player[this.layer].spent++;
				addBuyables(this.layer, this.id, 1);
			},
		},
		respec() {
			setBuyableAmount("em", 11, new Decimal(0));
			setBuyableAmount("em", 12, new Decimal(0));
			setBuyableAmount("em", 13, new Decimal(0));
			setBuyableAmount("em", 14, new Decimal(0));
			player.em.spent = new Decimal(0);
			doReset("co", true, true);
			doReset("l", true, true);
			doReset("t", true, true);
		},
		respecText: "respec aspect points",
		respecMessage: 'Are you sure you want to respec? This will force you to do "Continent", "Leader", and "Territory" resets as well!',
	},
	milestones: {
		0: {
			requirement: "1e500000",
			requirementDescription: "EXP phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.1},
			effectDescription() {return "increase the base effect of EXP by 0.1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return player.em.points.gte(2)},
		},
		1: {
			requirement: "1e600000",
			requirementDescription: "Empire phase I",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first empire effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		2: {
			requirement: "1e700000",
			requirementDescription: "ECO phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the effect of ECO by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		3: {
			requirement: "1e800000",
			requirementDescription: "WAR phase I",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the base effect of WAR by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		4: {
			requirement: "1e900000",
			requirementDescription: "REV phase I",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the cost scaling of REV<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		5: {
			requirement: "e1000000",
			requirementDescription: "WAR phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "increase the base effect of WAR by 1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		6: {
			requirement: "e1100000",
			requirementDescription: "ECO phase II",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the cost scaling of ECO<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		7: {
			requirement: "e1200000",
			requirementDescription: "EXP phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.02},
			effectDescription() {return "increase the base effect of EXP by 0.02<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		8: {
			requirement: "e1300000",
			requirementDescription: "REV phase II",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "increase the base effect of REV by 0.03<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
		9: {
			requirement: "e1400000",
			requirementDescription: "Empire phase II",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the cost scaling of EXP and WAR<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.ex.influence.gte(this.requirement)},
			unlocked() {return hasMilestone("em", this.id - 1)},
		},
	},
});
