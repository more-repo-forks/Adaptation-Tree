function getMaxChange() {
	return tmp.r.effect[3].mul(600).div(player.r.milestones.length + 1);
};

addLayer("r", {
	name: "Revolution",
	symbol: "R",
	position: 1,
	branches: ["sp", "e", "cb"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		change: new Decimal(0),
	}},
	color: "#EE7770",
	nodeStyle() {if (tmp.r.canReset || player.r.unlocked) return {"background": "border-box linear-gradient(to right, #55B020, #EE7770, #B44990)"}},
	resource: "revolutions",
	row: 4,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (challengeCompletions("ec", 11) >= 3 && challengeEffect("ec", 11)[2]) base -= challengeEffect("ec", 11)[2];
		if (challengeCompletions("ec", 11) >= 12 && challengeEffect("ec", 11)[11]) base -= challengeEffect("ec", 11)[11];
		if (getGridData("w", 403)) base -= gridEffect("w", 403);
		return base;
	},
	exponent() {return inChallenge("co", 11) ? 2 : 1},
	roundUpCost: true,
	canBuyMax() {return player.l.points.gte(3) || player.cy.unlocked},
	resetDescription: "Revolutionize for ",
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("d", 17)) mult = mult.div(milestoneEffect("d", 17));
		if (getGridData("w", 106)) mult = mult.div(gridEffect("w", 106));
		if (tmp.ec.effect[3]) mult = mult.div(tmp.ec.effect[3]);
		if (tmp.ex.effect[5]) mult = mult.div(tmp.ex.effect[5]);
		if (tmp.l.effect[1]) mult = mult.div(tmp.l.effect[1]);
		if (tmp.co.effect[1]) mult = mult.div(tmp.co.effect[1]);
		if (tmp.co.effect[3]) mult = mult.div(tmp.co.effect[3]);
		return mult;
	},
	directMult() {
		let mult = new Decimal(1);
		if (tmp.cy.effect[1]) mult = mult.mul(tmp.cy.effect[1]);
		return mult;
	},
	effect() {
		let changeEff2exp = 0.5;
		if (hasMilestone("r", 6)) changeEff2exp += 0.78;
		if (hasMilestone("r", 20)) changeEff2exp += 0.72;
		if (hasMilestone("r", 23)) changeEff2exp += 6;
		if (hasMilestone("r", 32)) changeEff2exp += 3;
		if (hasMilestone("r", 36)) changeEff2exp += 9;
		let changeEff3exp = 0.05;
		if (hasMilestone("r", 7)) changeEff3exp += 0.072;
		if (hasMilestone("r", 11)) changeEff3exp += 0.0234;
		if (hasMilestone("r", 32)) changeEff3exp += 99.8546;
		let eff = [
			new Decimal(challengeCompletions("ec", 11) >= 9 ? 10 : 2).pow(player.r.points.pow(hasMilestone("r", 12) ? 1.5 : 1)),
			new Decimal(5).pow(player.r.points),
			player.r.points.div(10).add(1).min(2),
			player.r.points.pow(2).mul(new Decimal(10).pow(player.r.points.sub(1))).mul((player.r.milestones.length + 1) ** (challengeCompletions("ec", 11) >= 9 ? 5 : 2)),
			new Decimal(10).pow(player.r.change.pow(hasMilestone("r", 11) ? 0.25 : 0.5)),
			(hasMilestone("r", 0) ? (hasMilestone("r", 20) ? player.r.change.add(1).pow(changeEff2exp) : player.r.change.add(1).pow(changeEff2exp).log10().add(1)) : new Decimal(1)),
			(hasMilestone("r", 1) ? player.r.change.add(1).pow(changeEff3exp).log10().add(1) : new Decimal(1)),
			(hasMilestone("r", 4) ? new Decimal(222).pow(player.r.change.pow(0.2)) : new Decimal(1)),
		];
		if (hasMilestone("r", 5)) eff[3] = eff[3].mul(milestoneEffect("r", 5));
		if (hasMilestone("r", 10)) eff[3] = eff[3].mul(milestoneEffect("r", 10));
		if (hasMilestone("r", 38)) eff[3] = eff[3].mul(milestoneEffect("r", 38));
		if (tmp.w.effect[0] && player.t.points.gte(10)) eff[3] = eff[3].mul(tmp.w.effect[0]);
		if (tmp.l.effect[3]) eff[3] = eff[3].mul(tmp.l.effect[3]);
		if (hasMilestone("r", 11)) {
			if (eff[4].gte("e10000000")) eff[4] = eff[4].div("e10000000").pow(0.1).mul("e10000000");
			if (eff[4].gte("e100000000")) eff[4] = eff[4].div("e100000000").pow(0.1).mul("e100000000");
			if (eff[4].gte("e500000000")) eff[4] = eff[4].div("e500000000").pow(0.05).mul("e500000000");
			if (eff[4].gte("e2e9")) eff[4] = eff[4].div("e2e9").pow(0.2).mul("e2e9");
			if (eff[4].gte("e4e9")) eff[4] = eff[4].div("e4e9").pow(0.4).mul("e4e9");
			if (eff[4].gte("e6e9")) eff[4] = eff[4].div("e6e9").pow(0.6).mul("e6e9");
			if (eff[4].gte("e8e9")) eff[4] = eff[4].div("e8e9").pow(0.8).mul("e8e9");
			if (eff[4].gte("e1e10")) eff[4] = eff[4].div("e1e10").pow(0.01).mul("e1e10");
			if (eff[4].gte("e1.5e10")) eff[4] = eff[4].div("e1.5e10").pow(0.015).mul("e1.5e10");
			if (eff[4].gte("e2e10")) eff[4] = eff[4].div("e2e10").pow(0.02).mul("e2e10");
			if (eff[4].gte("e4e10")) eff[4] = eff[4].div("e4e10").pow(0.04).mul("e4e10");
			if (eff[4].gte("e6e10")) eff[4] = eff[4].div("e6e10").pow(0.06).mul("e6e10");
			if (eff[4].gte("e8e10")) eff[4] = eff[4].div("e8e10").pow(0.08).mul("e8e10");
			if (eff[4].gte("e1e11")) eff[4] = eff[4].div("e1e11").log10().add(1).pow(hasMilestone("r", 32) ? 1e10 : 1e8).mul("e1e11");
		} else {
			if (eff[4].gte("1e5555")) eff[4] = eff[4].div("1e5555").pow(0.1).mul("1e5555");
			if (eff[4].gte("1e200000")) eff[4] = eff[4].div("1e200000").log10().add(1).pow(2000).mul("1e200000");
		};
		if (eff[7].gte("1e3333")) eff[7] = eff[7].div("1e3333").pow(1/3).mul("1e3333");
		if (eff[7].gte("1e100000")) eff[7] = eff[7].div("1e100000").pow(0.1).mul("1e100000");
		if (eff[7].gte("e1000000")) eff[7] = eff[7].div("e1000000").pow(0.1).mul("e1000000");
		if (eff[7].gte("e2500000")) eff[7] = eff[7].div("e2500000").pow(0.025).mul("e2500000");
		if (eff[7].gte("e5000000")) eff[7] = eff[7].div("e5000000").pow(0.05).mul("e5000000");
		if (eff[7].gte("e7500000")) eff[7] = eff[7].div("e7500000").pow(0.075).mul("e7500000");
		if (eff[7].gte("e10000000")) eff[7] = eff[7].div("e10000000").log10().add(1).pow(hasMilestone("r", 26) ? 1000000 : 100000).mul("e10000000");
		return eff;
	},
	effectDescription() {return "which are dividing the species requirement by /" + format(tmp.r.effect[0]) + ", dividing conscious being requirement by /" + format(tmp.r.effect[1]) + ", multiplying the completion limit of the 10th retrogression by " + format(tmp.r.effect[2]) + "x (" + (tmp.r.effect[2].gte(2) ? "maxed" : "rounded down") + "), and generating " + format(tmp.r.effect[3]) + " change per second (with a limit of " + format(getMaxChange()) + ")"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "After revolutionizing 1 time, you can bulk complete the 10th hybridization.<br><br>The above extra effect will not go away even if this layer is reset.";
			if (player.r.points.gte(2)) text += "<br><br>After revolutionizing 3 times, you keep hybridization completions on all resets.";
			if (player.r.points.gte(5)) text += "<br>After revolutionizing 6 times, you keep growth enhancements on all resets.";
			if (player.r.points.gte(8)) text += "<br>After revolutionizing 9 times, you bulk 10x stats from rows 3 and below.";
			text += "<br><br>You have <h2 style='color: #EE7770; text-shadow: #EE7770 0px 0px 10px'>" + format(player.r.change) + "</h2> change, which divides the evolution requirement by /" + format(tmp.r.effect[4]);
			if (hasMilestone("r", 4)) text += ", divides the domination requirement by /" + format(tmp.r.effect[5]) + ", divides the ecosystem requirement by /" + format(tmp.r.effect[6]) + ", and divides the acclimation requirement by /" + format(tmp.r.effect[7]);
			else if (hasMilestone("r", 1)) text += ", divides the domination requirement by /" + format(tmp.r.effect[5]) + " and divides the ecosystem requirement by /" + format(tmp.r.effect[6]);
			else if (hasMilestone("r", 0)) text += " and divides the domination requirement by /" + format(tmp.r.effect[5]);
			return text;
		}],
		"blank",
		"milestones",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 2 || player.r.unlocked},
	hotkeys: [{
		key: "r",
		description: "R: reset for revolutions",
		onPress() {if (player.r.unlocked) doReset("r")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		if (hasMilestone("r", 34) && layers[resettingLayer].row == 5) keep.push("milestones", "lastMilestone");
		layerDataReset("r", keep);
	},
	update(diff) {
		if (player.r.change.lt(getMaxChange())) player.r.change = player.r.change.add(tmp.r.effect[3].mul(diff)).min(getMaxChange());
	},
	componentStyles: {
		"prestige-button"() {if (tmp.r.canReset && tmp.r.nodeStyle) return tmp.r.nodeStyle},
	},
	milestones: {
		0: {
			requirement: 10000,
			requirementDescription: "1st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock an additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
		},
		1: {
			requirement: 500000,
			requirementDescription: "2nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock another additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		2: {
			requirement: 100000000,
			requirementDescription: "3rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "make buying CRA, FER, ANA, and SOV not spend any<br>acclimation points, but multiply their costs by 50<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		3: {
			requirement: 5e9,
			requirementDescription: "4th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "make population amount always set to its maximum<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		4: {
			requirement: 1e11,
			requirementDescription: "5th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock yet another additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		5: {
			requirement: 1e13,
			requirementDescription: "6th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.ec.points.add(1)},
			effectDescription() {return "multiply change gain and limit based on ecosystems<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		6: {
			requirement: 1e16,
			requirementDescription: "7th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		7: {
			requirement: 5e17,
			requirementDescription: "8th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the third change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		8: {
			requirement: 1e20,
			requirementDescription: "9th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce influence tickspeed cost by 1 purchase<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		9: {
			requirement: 1e22,
			requirementDescription: "10th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "unlock another influence generator<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		10: {
			requirement: 1e25,
			requirementDescription: "11th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.ex.points.add(1).mul(player.w.points.add(1))},
			effectDescription() {return "multiply change gain and limit based on expansion points and wars<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		11: {
			requirement: 5e27,
			requirementDescription: "12th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first and third change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		12: {
			requirement: 1e31,
			requirementDescription: "13th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first revolution effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		13: {
			requirement: 5e35,
			requirementDescription: "14th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		14: {
			requirement: 1e39,
			requirementDescription: "15th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return (player.l.unlocked ? "effect overriden by leaders" : "unlock more automation for domination") + "<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.l.unlocked},
		},
		15: {
			requirement: 1e44,
			requirementDescription: "16th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 1},
			effectDescription() {return "unlock another tier of ANACHRONISM<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		16: {
			requirement: 1e48,
			requirementDescription: "17th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		17: {
			requirement: 1e52,
			requirementDescription: "18th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.03},
			effectDescription() {return "decrease the war requirement base by 0.03<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		18: {
			requirement: 1e55,
			requirementDescription: "19th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the war requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		19: {
			requirement: 1e58,
			requirementDescription: "20th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first ecosystem effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.co.unlocked},
		},
		20: {
			requirement: 1e62,
			requirementDescription: "21st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		21: {
			requirement: 1e67,
			requirementDescription: "22nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		22: {
			requirement: 1e73,
			requirementDescription: "23rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		23: {
			requirement: 1e79,
			requirementDescription: "24th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		24: {
			requirement: 1e84,
			requirementDescription: "25th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the war requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		25: {
			requirement: 1e90,
			requirementDescription: "26th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.11},
			effectDescription() {return "decrease the domination requirement base by 0.11<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		26: {
			requirement: 1e100,
			requirementDescription: "27th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the last softcap of the last change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		27: {
			requirement: 1e110,
			requirementDescription: "28th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the first war effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		28: {
			requirement: 1e120,
			requirementDescription: "29th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.022},
			effectDescription() {return "decrease the war requirement base by 0.022<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		29: {
			requirement: 1e130,
			requirementDescription: "30th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.1},
			effectDescription() {return "decrease the acclimation requirement base by 0.1<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.t.unlocked},
		},
		30: {
			requirement: 1e140,
			requirementDescription: "31st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the last expansion effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		31: {
			requirement: 1e150,
			requirementDescription: "32nd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		32: {
			requirement: 1e160,
			requirementDescription: "33rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "weaken the last softcap of the first change effect<br>and improve the second and third change effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		33: {
			requirement: 1e170,
			requirementDescription: "34th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		34: {
			requirement: 1e180,
			requirementDescription: "35th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "keep innovations on row 6 resets<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		35: {
			requirement: 1e190,
			requirementDescription: "36th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "reduce the costs of row 2 control nodes<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		36: {
			requirement: 1e200,
			requirementDescription: "37th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second change effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		37: {
			requirement: 1e220,
			requirementDescription: "38th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the second control effect<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		38: {
			requirement: 1e240,
			requirementDescription: "39th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.co.points.add(1).mul(player.l.points.add(1)).mul(player.t.points.add(1)).pow(6)},
			effectDescription() {return "multiply change gain and limit based on row 6 resources<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		39: {
			requirement: 1e260,
			requirementDescription: "40th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1) || player.cy.unlocked},
		},
		40: {
			requirement: 1e280,
			requirementDescription: "41st innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "improve the expansion effects<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		41: {
			requirement: 1e300,
			requirementDescription: "42nd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.025},
			effectDescription() {return "decrease the territory requirement base by 0.025<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		42: {
			requirement: "1e320",
			requirementDescription: "43rd innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the leader requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		43: {
			requirement: "1e340",
			requirementDescription: "44th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "the growth requirement scales less while in the <b>Migration</b><br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		44: {
			requirement: "1e360",
			requirementDescription: "45th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "expand the enhancable battle grid<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		45: {
			requirement: "1e380",
			requirementDescription: "46th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease the leader requirement base by 0.05<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
	},
});
