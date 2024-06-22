function getSettlerGain() {
	return player.cb.points.div(100).floor();
};

function getSettlerMax() {
	return getSettlerGain().mul(100);
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
	canBuyMax() {return false},
	resetDescription: "Explore for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {
		let eff = [
			new Decimal(5).pow(player.co.points),
			new Decimal(10).pow(player.co.points),
			player.co.points.div(4).add(1),
			new Decimal(1.02).pow(player.co.settlers),
		];
		if (eff[3].gte(500)) eff[3] = eff[3].div(500).pow(0.5).mul(500);
		return eff;
	},
	effectDescription() {return "which are dividing the ecosystem requirement by /" + format(tmp.co.effect[0]) + ", dividing the revolution requirement by /" + format(tmp.co.effect[1]) + ", and directly multiplying species gain by " + format(tmp.co.effect[2]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "You keep hybridization completions on continent resets.<br><br>After exploring 1 time, automation for influence is unlocked.<br><br>The above extra effect will not go away even if this layer is reset."],
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
		"challenge"() {return {"width": "400px", "height": "400px", "background": "none", "border-radius": "10%", "border-color": "#55B020", "color": "var(--color)", "cursor": "default"}},
	},
	challenges: {
		11: {
			name: "Migration",
			fullDisplay() {
				let text = "";
				text += "Entering the Migration does a continent reset.";
				text += "<br><br>While in the Migration:";
				text += "<br><br>Power and stimulation gain is log<sub>10</sub>(gain) + 1";
				text += "<br><br>Requirements of all resources from rows 2-5 scale much faster (based on continents up to 1,000)";
				text += "<br><br>You gain settlers based on your conscious beings";
				text += "<br>(" + formatWhole(getSettlerGain()) + "/sec with a limit of " + formatWhole(getSettlerMax()) + ")";
				text += "<br><br><hr style='border: 2px solid #55B020'>";
				text += "<br>You have <h2 style='color: #55B020; text-shadow: #55B020 0px 0px 10px'>" + formatWhole(player.co.settlers) + "</h2> settlers, which are dividing the revolution requirement by /" + format(tmp.co.effect[3]);
				return text;
			},
			canComplete() {return false},
			unlocked() {return player.co.migrationUnlocked},
		},
	},
});

addNode("blank", {
	symbol: "T",
	branches: ["ex", "d", "w"],
	position: 2,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked() {return "Reach 100,000 domination points to unlock (You have " + formatWhole(player.d.points) + " domination points)"},
	row: 5,
	layerShown() {return challengeCompletions("ec", 11) >= 16},
});
