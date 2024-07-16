function getSettlerGain() {
	return player.cb.points.div(100).floor();
};

function getSettlerMax() {
	return player.cb.points.div(100).floor().mul(100);
};

addLayer("co", {
	name: "Continent",
	symbol: "CO",
	position: 0,
	branches: ["ec", "sp", "r"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		migrationUnlocked: false,
		settlers: new Decimal(0),
	}},
	color: "#55B020",
	nodeStyle() {if (tmp.co.canReset || player.co.unlocked) return {"background": "border-box linear-gradient(to right, #116022, #55B020, #B44990)"}},
	resource: "continents",
	row: 5,
	baseResource: "species",
	baseAmount() {return player.sp.points},
	requires: new Decimal(100000),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return player.cy.unlocked},
	resetDescription: "Explore for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {
		let amt = player.co.points;
		if (tmp.cy.effect[0]) amt = amt.add(tmp.cy.effect[0]);
		let continentEff2Base = 10;
		if (challengeCompletions("ec", 11) >= 19) continentEff2Base += 20;
		if (hasMilestone("r", 63)) continentEff2Base += 15;
		let settlerEff2Exp = 0.0125;
		if (hasMilestone("d", 63)) settlerEff2Exp += 0.0175;
		let lastSettlerEffExp = 0.25;
		if (hasMilestone("r", 48)) lastSettlerEffExp += 0.25;
		if (hasMilestone("d", 63)) lastSettlerEffExp += 0.25;
		let eff = [
			new Decimal(challengeCompletions("ec", 11) >= 19 ? 10 : 5).pow(amt),
			new Decimal(continentEff2Base).pow(amt),
			amt.div(4).add(1),
			new Decimal(1.02).pow(player.co.settlers),
			(player.co.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10) || player.cy.unlocks[0] >= 8 ? player.co.settlers.add(1).pow(settlerEff2Exp) : new Decimal(1)),
			(player.co.points.gte(player.cy.unlocks[1] >= 4 ? 6 : 10) && player.cy.unlocks[0] >= 8 ? player.co.settlers.add(1).pow(lastSettlerEffExp) : new Decimal(1)),
		];
		if (eff[3].gte(500)) eff[3] = eff[3].div(500).pow(0.5).mul(500);
		if (eff[3].gte(5000)) eff[3] = eff[3].div(5000).pow(0.5).mul(5000);
		if (eff[3].gte(2000000)) eff[3] = eff[3].div(2000000).pow(hasMilestone("d", 63) ? 0.5 : 0.2).mul(2000000);
		return eff;
	},
	effectDescription() {return "which are dividing the ecosystem requirement by /" + format(tmp.co.effect[0]) + ", dividing the revolution requirement by /" + format(tmp.co.effect[1]) + ", and directly multiplying species gain by " + format(tmp.co.effect[2]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep hybridization completions on continent resets.<br><br>After exploring 1 time, automation for influence is unlocked.<br><br>The above extra effect will not go away even if this layer is reset.";
			if (player.cy.unlocks[1] >= 4 && player.co.points.gte(5)) text += "<br><br>After exploring 6 times, you unlock another effect for settlers.";
			else if (player.co.points.gte(9)) text += "<br><br>After exploring 10 times, you unlock another effect for settlers.";
			return text;
		}],
		"blank",
		["challenge", 11],
		"blank",
	],
	layerShown() {return challengeCompletions("ec", 11) >= 16 || player.co.unlocked},
	hotkeys: [{
		key: "o",
		description: "O: reset for continents",
		onPress() {if (player.co.unlocked) doReset("co")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("co", keep);
	},
	update(diff) {
		if (challengeCompletions("ec", 11) >= 17 && !player.co.migrationUnlocked) player.co.migrationUnlocked = true;
		if (inChallenge("co", 11)) {
			let max = getSettlerMax();
			if (player.co.settlers.lt(max)) player.co.settlers = player.co.settlers.add(getSettlerGain().mul(diff)).min(max);
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.co.canReset && tmp.co.nodeStyle) return tmp.co.nodeStyle},
		"challenge"() {return {"width": "500px", "height": "500px", "background": "none", "border-radius": "10%", "border-color": "#55B020", "color": "var(--color)", "cursor": "default"}},
	},
	challenges: {
		11: {
			name: "Migration",
			fullDisplay() {
				let text = "";
				text += "Entering the Migration does a continent reset.";
				text += "<br><br>While in the Migration:";
				text += "<br><br>Power and stimulation gain is log<sub>10</sub>(gain) + 1";
				text += "<br><br>Requirements of all resources from rows 2-5 scale much faster";
				text += "<br>(growth scaling is based on continents up to " + (hasMilestone("r", 43) ? "500" : "1,000") + ")";
				text += "<br><br>You cannot buy anything in the battle grid";
				text += "<br><br>You gain settlers based on your conscious beings";
				text += "<br>(" + formatWhole(getSettlerGain()) + "/sec with a limit of " + formatWhole(getSettlerMax()) + ")";
				text += "<br><br><hr style='border: 2px solid #55B020'>";
				text += "<br>You have <h2 style='color: #55B020; text-shadow: #55B020 0px 0px 10px'>" + formatWhole(player.co.settlers) + "</h2> settlers, which are currently:";
				text += "<br><br>dividing the revolution requirement by /" + format(tmp.co.effect[3]);
				if (player.co.points.gte(10) || player.cy.unlocks[0] >= 8) text += "<br><br>dividing the focus+ requirement by /" + format(tmp.co.effect[4]);
				if (player.co.points.gte(10) && player.cy.unlocks[0] >= 8) text += "<br><br>dividing the ecosystem and war requirements by /" + format(tmp.co.effect[5]);
				return text;
			},
			canComplete() {return false},
			unlocked() {return player.co.migrationUnlocked},
		},
	},
});
