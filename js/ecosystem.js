addLayer("ec", {
	name: "Ecosystem",
	symbol: "EC",
	position: 0,
	branches: ["sp"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		chronoTime: 0,
	}},
	color: "#116022",
	resource: "ecosystems",
	row: 4,
	baseResource: "species",
	baseAmount() {return player.sp.points},
	requires: new Decimal(30),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Ecologically succeed for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		new Decimal(5).pow(player.ec.points),
		player.ec.points.mul(5),
		new Decimal(100).pow(player.ec.points).min(1e300),
	]},
	effectDescription() {return "which are dividing the species requirement by /" + format(tmp.ec.effect[0]) + ", increasing the completion limit of the 10th hybridization by +" + format(tmp.ec.effect[1]) + ", and generating +" + format(tmp.ec.effect[2]) + "% of potential stimulations per second"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", () => {
			let text = "You keep hybridization completions on ecosystem resets.<br><br>After succeeding 1 time, more automation for acclimation is always unlocked<br>and you can always bulk species, conscious beings, and domination points.<br><br>The above extra effects will not go away even if this layer is reset.";
			if (player.ec.points.gte(2)) text += "<br><br>After succeeding 3 times, you keep retrogression completions on all resets.";
			return text;
		}],
		"blank",
		["raw-html", () => {
			let html = "<div class='challenge " + challengeStyle("ec", 11);
			html += "' style='width: 500px; height: 500px; border-radius: 50%; border-color: #116022; color: #116022'>";
			html += "<div style='height: 210px; display: flex'><h1>" + tmp.ec.challenges[11].name + "</h1></div>";
			html += "<div style='height: 210px; display: flex; margin-top: 80px'><span>" + layers.ec.challenges[11].fullDisplay() + "</span></div><button";
			if (tmp.ec.challenges[11].enterable) html += " class='can' style='position: absolute; top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px; border: none; border-radius: 50%; background-color: #116022; color: #FFFFFF; z-index: 1; transform: none; box-shadow: none'";
			else html += " class='locked' style='position: absolute; top: calc(50% - 50px); left: calc(50% - 50px); width: 100px; height: 100px; border: 5px solid #116022; border-radius: 50%; background-color: var(--locked); color: #116022; z-index: 1; transform: none; box-shadow: none'";
			html += " onclick='if (tmp.ec.challenges[11].enterable) startChallenge(\"ec\", 11)'>";
			html += challengeButtonText("ec", 11) + "</button>";
			let rotation = (player.ec.activeChallenge == 11 ?
				Math.floor(player.ec.chronoTime - Date.now() / 1000) % 60 * 6
				: Math.floor(Date.now() / 1000 - player.ec.chronoTime) % 60 * 6
			);
			html += "<div style='position: absolute; top: -2px; left: 247.5px; width: 5px; height: 252px; background-color: #116022C0; transform-origin: 50% 100%; transform: rotate(" + rotation + "deg)'></div>";
			html += "<button onclick='if (player.ec.unlocked && tmp.ec.challenges[11].enterable && player.ec.chronoTime !== 0) player.ec.chronoTime = 0'";
			if (player.ec.unlocked && tmp.ec.challenges[11].enterable && player.ec.chronoTime !== 0) html += " class='can' style='position: absolute; top: 430px; left: 430px; width: 70px; height: 70px; border: none; border-radius: 50%; background-color: #116022; color: #FFFFFF; transform: none; box-shadow: none'>SYNC OFF</button>";
			else html += " class='locked' style='position: absolute; top: 430px; left: 430px; width: 70px; height: 70px; border: 5px solid #116022; border-radius: 50%; background-color: var(--locked); color: #116022; transform: none; box-shadow: none'>SYNC ON</button>";
			return html;
		}],
		"blank",
	],
	layerShown() {return hasChallenge("sp", 19) || player.ec.unlocked},
	hotkeys: [{
		key: "c",
		description: "C: reset for ecosystems",
		onPress() {if (player.ec.unlocked) doReset("ec")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("ec", keep);
	},
	update(diff) {
		if (inChallenge("ec", 11)) {
			Vue.set(player.e, "activeChallenge", 21);
			Vue.set(player.sp, "activeChallenge", 21);
		};
	},
	challenges: {
		11: {
			name() {return "ANACHRONISM " + (["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"][challengeCompletions("ec", 11)] || "XII")},
			fullDisplay() {
				if (challengeCompletions("sp", 21) >= 20 || hasChallenge("ec", 11)) return "Entering any ANACHRONISM does a species reset.<br><br>While in " + tmp.ec.challenges[11].name + ", the evolution and acclimation<br>requirement bases are multipled by " + formatWhole(tmp.ec.challenges[11].penalty) + ".<br><br>While in any ANACHRONISM, you are trapped in<br>the 10th retrogression and hybridization.<br><br>Goal: " + formatWhole(tmp.ec.challenges[11].goal) + " growth points<br><br>Completed: " + formatWhole(challengeCompletions("ec", 11)) + "/" + formatWhole(tmp.ec.challenges[11].completionLimit);
				return "You need 20 completions of the 10th hybridization<br>to unlock " + tmp.ec.challenges[11].name + ".";
			},
			// rewardEffect() {return challengeCompletions("ec", 11)},
			goal() {return [152288][challengeCompletions("ec", 11)] || Infinity},
			canComplete() {return player.g.points.gte(this.goal())},
			unlockReq: 21,
			enterable() {return challengeCompletions("sp", 21) >= 20 || hasChallenge("ec", 11)},
			doReset: false,
			completionLimit: 12,
			onEnter() {doReset("sp", true, true); player.ec.chronoTime = Date.now() / 500 - player.ec.chronoTime},
			onExit() {doReset("sp", true, true); player.ec.chronoTime = Date.now() / 500 - player.ec.chronoTime},
			penalty() {return 10 ** (Math.min(challengeCompletions("ec", 11), tmp.ec.challenges[11].completionLimit) + 1)},
		},
	},
});
