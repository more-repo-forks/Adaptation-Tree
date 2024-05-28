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
		if (player.e.points.gte(1591)) base -= 0.0375;
		if (player.e.points.gte(2171)) base -= 0.0075;
		if (player.e.points.gte(2420)) base -= 0.03;
		return base;
	},
	exponent: 1,
	canBuyMax() {return false},
	resetDescription: "Speciate for ",
	gainMult() {
		let mult = new Decimal(1);
		if (hasChallenge("sp", 14)) mult = mult.div(challengeEffect("sp", 14));
		if (player.d.unlocks[1]) mult = mult.div(buyableEffect("d", 12));
		return mult;
	},
	effect() {
		// base
		let base0 = player.sp.points;
		if (hasChallenge("sp", 11)) base0 = base0.mul(2);
		if (hasChallenge("sp", 12)) base0 = base0.mul(challengeEffect("sp", 12));
		if (hasChallenge("sp", 13)) base0 = base0.mul(2);
		if (hasChallenge("sp", 14)) base0 = base0.mul(2);
		if (hasChallenge("sp", 15)) base0 = base0.mul(2);
		if (hasChallenge("sp", 16)) base0 = base0.mul(5);
		// exponent
		let exp2 = 0.2;
		if (player.sp.points.gte(6)) exp2 += 0.3;
		if (hasChallenge("sp", 11)) exp2 += 0.075;
		// return
		if (player.sp.points.gte(6)) return [
			base0.pow(player.sp.points),
			player.sp.points.pow(2),
			player.sp.points.pow(exp2),
		];
		return [
			base0.pow(0.5).div(2).add(1.5).pow(player.sp.points),
			player.sp.points.add(1),
			player.sp.points.mul(5).add(1).pow(exp2),
		];
	},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.sp.effect[0]) + ", multiplying the extra STR, WIS, AGI, and INT from evolutions by " + format(tmp.sp.effect[1]) + "x, and exponentiating evolution amount in the last evolution effect by ^" + format(tmp.sp.effect[2])},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep retrogression completions on species resets.<br><br>After speciating 1 time, you can always bulk growth and evolutions,<br>the effect of <b>Growth enhancement I</b> is always changed,<br>and more automation for growth is always unlocked.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.sp.points.gte(5)) text += "<br><br>After speciating 6 times, all species effects are massively improved.";
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
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, you cannot buy CRA, FER, or SOV.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, the exponent of the last species effect is increased by 0.075, and acclimation requirement is divided based on species (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(1.3).pow(player.sp.points)},
			goal: 692,
			canComplete() {return player.e.points.gte(this.goal)},
			unlockReq: 8,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			overrideResetsNothing: true,
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
			overrideResetsNothing: true,
			style: {"width": "250px", "height": "360px"},
		},
		13: {
			name: "3rd Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, the original evolution requirement base is set to 2.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, focus requirement is divided by 2, and acclimation requirement is divided based on conscious beings (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return new Decimal(1.36).pow(player.cb.points)},
			goal: 537,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 10,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			overrideResetsNothing: true,
			style: {"width": "250px", "height": "360px"},
		},
		14: {
			name: "4th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, the original acclimation requirement base is set to 10.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, the last conscious beings effect is powered to 1.5, and species requirement is divided based on acclimation points past 200 (currently&nbsp;/" + format(this.rewardEffect()) + ")";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {
				if (hasChallenge("sp", 16)) return new Decimal(1.02).pow(player.a.points.sub(200).pow(0.5)).max(1);
				return new Decimal(1.01).pow(player.a.points.sub(200).pow(0.5)).max(1);
			},
			goal: 1096,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 12,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			overrideResetsNothing: true,
			style: {"width": "250px", "height": "360px"},
		},
		15: {
			name: "5th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, all previous in hybridization effects are applied.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 2, base acclimation requirement is decreased by 0.0505, focus requirement is divided by 1.5, and a new layer is unlocked" + (player.d.unlocked ? " (already unlocked)" : "");
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return 0.0505},
			goal: 501,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 13,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			overrideResetsNothing: true,
			countsAs: [11, 12, 13, 14],
			style: {"width": "250px", "height": "360px"},
		},
		16: {
			name: "6th Hybridization",
			fullDisplay() {
				if (player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)) return "Entering this hybridization does a species reset.<br>While in this hybridization, conscious beings and focus do nothing.<br><br>Goal: " + formatWhole(this.goal) + " evolutions<br><br>Rewards: The base of the first species effect is multiplied by 5, base acclimation requirement is decreased by 0.01, and the 4th hybridization's last effect is improved.";
				return "You need " + formatWhole(this.unlockReq) + " species to unlock this hybridization.";
			},
			rewardEffect() {return 0.01},
			goal: 2067,
			canComplete() {return player.e.points.gte(this.goal)},
			unlocked() {return hasChallenge("e", this.id - 1) || hasChallenge("e", this.id)},
			unlockReq: 15,
			enterable() {return player.sp.points.gte(this.unlockReq) || hasChallenge("sp", this.id)},
			doReset: true,
			overrideResetsNothing: true,
			style: {"width": "250px", "height": "360px"},
		},
	},
});
