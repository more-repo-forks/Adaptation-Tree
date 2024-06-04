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
	nodeStyle() {if (tmp.r.canReset || player.r.unlocked) return {"background": "border-box linear-gradient(to right, #55B020, #EE7770, #B3478F)"}},
	resource: "revolutions",
	row: 4,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(20000),
	type: "static",
	base() {
		let base = 5;
		if (challengeCompletions("ec", 11) >= 3 && challengeEffect("ec", 11)[2]) base -= challengeEffect("ec", 11)[2];
		return base;
	},
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Revolutionize for ",
	gainMult() {
		let mult = new Decimal(1);
		if (hasMilestone("d", 17)) mult = mult.div(milestoneEffect("d", 17));
		return mult;
	},
	effect() {
		let eff = [
			new Decimal(2).pow(player.r.points),
			new Decimal(5).pow(player.r.points),
			player.r.points.div(10).add(1).min(2),
			player.r.points.pow(2).mul(new Decimal(10).pow(player.r.points.sub(1))).mul((player.r.milestones.length + 1) ** 2),
			new Decimal(10).pow(player.r.change.pow(0.5)),
			(hasMilestone("r", 0) ? player.r.change.add(1).pow(hasMilestone("r", 6) ? 1.28 : 0.5).log10().add(1) : new Decimal(1)),
			(hasMilestone("r", 1) ? player.r.change.add(1).pow(hasMilestone("r", 7) ? 0.122 : 0.05).log10().add(1) : new Decimal(1)),
			(hasMilestone("r", 4) ? new Decimal(222).pow(player.r.change.pow(0.2)) : new Decimal(1)),
		];
		if (hasMilestone("r", 5)) eff[3] = eff[3].mul(milestoneEffect("r", 5));
		if (eff[4].gte("1e5555")) eff[4] = eff[4].div("1e5555").pow(0.1).mul("1e5555");
		if (eff[4].gte("1e200000")) eff[4] = eff[4].div("1e200000").log10().pow(2000).mul("1e200000");
		if (eff[7].gte("1e3333")) eff[7] = eff[7].div("1e3333").pow(1/3).mul("1e3333");
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
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("r", keep);
	},
	update(diff) {
		player.r.change = player.r.change.add(tmp.r.effect[3].mul(diff)).min(getMaxChange());
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
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		2: {
			requirement: 100000000,
			requirementDescription: "3rd innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "buying CRA, FER, ANA, and SOV no longer spends any<br>acclimation points, but their costs are multipled by 50<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		3: {
			requirement: 5e9,
			requirementDescription: "4th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "population amount is always set to its maximum<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		4: {
			requirement: 1e11,
			requirementDescription: "5th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "unlock yet another additional effect for change<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		5: {
			requirement: 1e13,
			requirementDescription: "6th innovation",
			popupTitle: "Innovation Acquired!",
			effect() {return player.ec.points.add(1)},
			effectDescription() {return "change gain and limit is multiplied based on ecosystems<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		6: {
			requirement: 1e16,
			requirementDescription: "7th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "the second change effect is improved<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
		7: {
			requirement: 5e17,
			requirementDescription: "8th innovation",
			popupTitle: "Innovation Acquired!",
			effectDescription() {return "the third change effect is improved<br>Req: " + formatWhole(this.requirement) + " change"},
			done() {return player.r.change.gte(this.requirement)},
			unlocked() {return hasMilestone("r", this.id - 1)},
		},
	},
});
