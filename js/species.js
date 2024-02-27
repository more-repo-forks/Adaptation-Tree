addLayer("sp", {
	name: "Species",
	symbol: "SP",
	position: 0,
	branches: ["e"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
	}},
	color: "#4AA40E",
	resource: "species",
	row: 3,
	baseResource: "evolutions",
	baseAmount() {return player.e.points},
	requires: new Decimal(60),
	type: "static",
	base() {
		let base = 1.5;
		if (player.e.points.gte(824)) base -= 0.05;
		if (player.e.points.gte(1142)) base -= 0.03;
		if (player.e.points.gte(1372)) base -= 0.02;
		return base;
	},
	exponent: 1,
	resetDescription: "Speciate for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {
		// base
		let base0 = player.sp.points;
		if (hasChallenge("sp", 11)) base0 = base0.mul(2);
		if (hasChallenge("sp", 12)) base0 = base0.mul(challengeEffect("sp", 12));
		// exponent
		let exp2 = 0.5;
		if (hasChallenge("sp", 11)) exp2 += 0.075;
		// return
		if (player.sp.points.gte(6)) return [
			base0.pow(player.sp.points),
			player.sp.points.pow(2),
			player.sp.points.pow(exp2),
		];
		return [
			player.sp.points.pow(0.5).div(2).add(1.5).pow(player.sp.points),
			player.sp.points.add(1),
			player.sp.points.mul(5).add(1).pow(0.2),
		];
	},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.sp.effect[0]) + ", multiplying the extra STR, WIS, AGI, and INT from evolutions by " + format(tmp.sp.effect[1]) + "x, and exponentiating evolution amount in the last evolution effect by ^" + format(tmp.sp.effect[2])},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep retrogression completions on species resets.<br><br>After speciating 1 time, you can always bulk growth and evolutions,<br>the effect of <b>Growth enhancement I</b> is always changed,<br>and more automation for growth is always unlocked.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.sp.points.gte(5)) text += "<br><br>After speciating 6 times, all species effects are massively increased.";
			return text;
		}],
		"blank",
		"challenges",
		"blank",
	],
	layerShown() {return player.e.points.gte(60) || player.sp.unlocked},
	hotkeys: [{
		key: "p",
		description: "P: reset for species",
		onPress() {if (player.sp.unlocked) doReset("sp")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("sp", keep);
	},
	componentStyles: {
		"challenge"() {return {'border-radius': '50px'}},
	},
	challenges: {
		11: {
			name: "1st Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, you cannot buy CRA, FER, or SOV.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, the exponent of the last species effect is increased by 0.075, and acclimation point requirement is divided based on species (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(1.3).pow(player.sp.points)},
			goal: 692,
			canComplete() {return player.e.points.gte(this.goal)},
			unlockReq: 8,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			style: {"width": "250px", "height": "360px"},
		},
		12: {
			name: "2nd Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, you cannot buy ANA.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The extra STR, WIS, and AGI from evolutions is multiplied by 10, the base of the first species effect is multiplied based on hybridizations completed (currently&nbsp;" + format(this.rewardEffect()) + "x), and something new is unlocked in the conscious beings layer" + (player.cb.focusUnlocked ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {
				let hybridizations = 0;
				for (const id in player.sp.challenges) {
					if (Object.hasOwnProperty.call(player.sp.challenges, id)) {
						hybridizations += player.sp.challenges[id];
					};
				};
				return new Decimal(hybridizations).add(1);
			},
			goal: 1095,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 9,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			style: {"width": "250px", "height": "360px"},
		},
	},
});
