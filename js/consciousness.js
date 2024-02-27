addLayer("cb", {
	name: "Conscious Beings",
	symbol: "CB",
	position: 1,
	branches: ["e", "g", "a"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		focusUnlocked: false,
	}},
	color: "#E6B45A",
	nodeStyle: {"background": "border-box linear-gradient(to right, #ED6A5E, #E6B45A, #B3478F)"},
	resource: "conscious beings",
	row: 3,
	baseResource: "growth points",
	baseAmount() {return player.g.points},
	requires: new Decimal(1e15),
	type: "static",
	base: 10,
	exponent: 1,
	resetDescription: "Enlighten for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() {
		let eff = [
			new Decimal(100).pow(player.cb.points),
			new Decimal(5).pow(player.cb.points),
			player.cb.points.add(1),
		];
		if (player.cb.focusUnlocked) {
			let extra = tmp.g.buyables[11].extra.add(tmp.g.buyables[12].extra).add(tmp.g.buyables[13].extra).add(tmp.g.buyables[14].extra);
			eff[3] = extra.div(5e11).max(1).log2().floor().toNumber();
		};
		return eff;
	},
	effectDescription() {return "which are dividing the evolution requirement by /" + format(tmp.cb.effect[0]) + ", dividing the acclimation requirement by /" + format(tmp.cb.effect[1]) + ", and multiplying extra STR, WIS, AGI, and INT levels by " + format(tmp.cb.effect[2]) + "x"},
	tabFormat() {
		let text = "After enlightening 1 time, you can bulk acclimation points;<br>you keep all stimulation upgrades on row 2, 3, and 4 resets;<br>and you keep all growth enhancements on row 3 and 4 resets.<br><br>The above extra effects will not go away even if this layer is reset.";
		if (player.cb.points.gte(5)) text += "<br><br>After enlightening 6 times, you keep retrogression completions on row 4 resets.";
		let arr = [
			"main-display",
			"prestige-button",
			"resource-display",
			["display-text", text],
			"blank",
		];
		if (player.cb.focusUnlocked) {
			let svg = "<svg viewBox='0 0 500 50' style='width: 500px; height: 50px'>";
			let maximum = Math.max((getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0), tmp.cb.effect[3]);
			if (maximum > 0) {
				let right = (500 * getClickableState("cb", 12) / maximum);
				svg += "<rect x='0' y='0' width='" + (500 * getClickableState("cb", 11) / maximum) + "' height='50' fill='#ED6A5E'/>";
				svg += "<rect x='" + (500 - right) + "' y='0' width='" + right + "' height='50' fill='#B3478F'/>";
				let div = (2 ** Math.floor(Math.log2(maximum) - 5));
				if (div > 1) maximum /= div;
				for (let index = (maximum % 1) / 2; index < maximum; index++) {
					if (index == 0) continue;
					let x = (500 * index / maximum);
					svg += "<line x1='" + x + "' y1='0' x2='" + x + "' y2='50' stroke='#E6B45A'/>";
				};
			};
			svg += "</svg>";
			svg += "<div style='position: relative; float: left; margin: -54px 0px 0px 7.5px; font-size: 48px; color: #DFDFDF'>E</div>";
			svg += "<div style='position: relative; float: right; margin: -54px 9px 0px 0px; font-size: 48px; color: #DFDFDF'>A</div>";
			arr.push(["display-text", svg, {"display": "inline-block", "width": "500px", "height": "50px", "border": "solid 4px #E6B45A"}]);
			arr.push(["row", [["clickable", 13], ["clickable", 11], ["clickable", 15], ["clickable", 12], ["clickable", 14]]]);
			arr.push("blank");
			arr.push(["display-text", "You have " + formatWhole(tmp.g.buyables[11].extra.add(tmp.g.buyables[12].extra).add(tmp.g.buyables[13].extra).add(tmp.g.buyables[14].extra)) + " total extra growth stat levels,<br>making the maximum focus points be " + tmp.cb.effect[3] + ".<br><br>The next point can be gained at " + formatWhole(new Decimal(2).pow(tmp.cb.effect[3] + 1).mul(5e11)) + " extra levels."]);
			arr.push("blank");
			arr.push(["display-text", "<div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #ED6A5E; text-shadow: #ED6A5E 0px 0px 10px'>" + formatWhole(getClickableState("cb", 11)) + "</h2> focus points allocated to evolution, which are increasing the completion limit of the 10th retrogression by " + formatWhole(clickableEffect("cb", 11)) + ".</div><div style='display: inline-block; vertical-align: top; width: 50%'>You have <h2 style='color: #B3478F; text-shadow: #B3478F 0px 0px 10px'>" + formatWhole(getClickableState("cb", 12)) + "</h2> focus points allocated to acclimation, which are multiplying population maximum and gain by " + format(clickableEffect("cb", 12)) + "x.<div>"]);
			arr.push("blank");
		};
		return arr;
	},
	layerShown() {return hasMilestone("a", 39) || player.cb.unlocked},
	hotkeys: [{
		key: "b",
		description: "B: reset for conscious beings",
		onPress() {if (player.cb.unlocked) doReset("cb")},
	}],
	doReset(resettingLayer) {
		let keep = [];
		if (layers[resettingLayer].row > this.row) layerDataReset("cb", keep);
	},
	update(diff) {
		if (hasChallenge("sp", 12) && !player.cb.focusUnlocked) player.cb.focusUnlocked = true;
	},
	shouldNotify() {
		if (player.cb.focusUnlocked && (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]) return true;
	},
	componentStyles: {
		"prestige-button"() {if (tmp.cb.canReset) return {"background": "border-box linear-gradient(to right, #ED6A5E, #E6B45A, #B3478F)"}},
		"clickable"() {return {"min-height": "58px", "border": "solid 4px #E6B45A", "border-radius": "0px", "color": "#DFDFDF", "transform": "none"}},
	},
	clickables: {
		11: {
			title: "Focus on evolution",
			effect() {return (getClickableState("cb", 11) || 0)},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 11, (getClickableState("cb", 11) || 0) + 1)},
			onHold() {setClickableState("cb", 11, (getClickableState("cb", 11) || 0) + 1)},
			style: {"background-color": "#ED6A5E"},
		},
		12: {
			title: "Focus on acclimation",
			effect() {return new Decimal(10).pow(getClickableState("cb", 12) || 0)},
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 12, (getClickableState("cb", 12) || 0) + 1)},
			onHold() {setClickableState("cb", 12, (getClickableState("cb", 12) || 0) + 1)},
			style: {"background-color": "#B3478F"},
		},
		13: {
			title: "MAX E",
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 11, tmp.cb.effect[3] - (getClickableState("cb", 12) || 0))},
			style: {"width": "74px", "background-color": "#ED6A5E"},
		},
		14: {
			title: "MAX A",
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) < tmp.cb.effect[3]},
			onClick() {setClickableState("cb", 12, tmp.cb.effect[3] - (getClickableState("cb", 11) || 0))},
			style: {"width": "74px", "background-color": "#B3478F"},
		},
		15: {
			title: "Reset Focus",
			canClick() {return (getClickableState("cb", 11) || 0) + (getClickableState("cb", 12) || 0) > 0},
			onClick() {
				setClickableState("cb", 11, 0);
				setClickableState("cb", 12, 0);
			},
			style: {"background-color": "#000"},
		},
	},
});

addNode("blank", {
	symbol: "?",
	branches: ["a"],
	position: 2,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked: "coming soon!",
	row: 3,
	layerShown() {return hasMilestone("a", 39) || player.cb.unlocked},
});