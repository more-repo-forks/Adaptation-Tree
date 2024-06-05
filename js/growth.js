addLayer("g", {
	name: "Growth",
	symbol: "G",
	position: 0,
	branches: ["s"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
		autoSTR: false,
		autoWIS: false,
		autoAGI: false,
		autoINT: false,
	}},
	color: "#E6B45A",
	resource: "growth points",
	row: 1,
	baseResource: "stimulations",
	baseAmount() {return player.s.points},
	requires: new Decimal(100000000),
	type: "static",
	base() {
		let base = (inChallenge("sp", 18) ? 1e100 : (inChallenge("e", 17) || inChallenge("e", 21) ? 10 : 2));
		if (inChallenge("e", 18)) return base;
		if (hasUpgrade("s", 84)) base -= upgradeEffect("s", 84);
		if (hasMilestone("g", 18)) base -= milestoneEffect("g", 18);
		if (hasMilestone("g", 25)) base -= milestoneEffect("g", 25);
		if (hasMilestone("g", 31)) base -= milestoneEffect("g", 31);
		if (hasMilestone("g", 36)) base -= milestoneEffect("g", 36);
		if (hasMilestone("g", 38)) base -= milestoneEffect("g", 38);
		if (hasMilestone("g", 44)) base -= milestoneEffect("g", 44);
		if (hasMilestone("g", 49)) base -= milestoneEffect("g", 49);
		if (hasMilestone("g", 53)) base -= milestoneEffect("g", 53);
		if (hasMilestone("g", 59)) base -= milestoneEffect("g", 59);
		if (hasMilestone("g", 68)) base -= milestoneEffect("g", 68);
		if (hasMilestone("g", 74)) base -= milestoneEffect("g", 74);
		if (player.e.points.gte(570)) base -= 0.025;
		if (player.e.points.gte(635)) base -= 0.015;
		if (player.e.points.gte(974)) base -= 0.002;
		if (hasChallenge("e", 18)) base -= 0.01;
		return base;
	},
	exponent: 1,
	canBuyMax() {return hasMilestone("g", 8) || player.e.unlocked},
	resetDescription: "Grow for ",
	gainMult() {
		let mult = new Decimal(1);
		if (inChallenge("e", 18)) return mult;
		if (inChallenge("e", 21)) {
			if (player.e.points.gte(1425)) return mult.div(buyableEffect("g", 13)).div(new Decimal("1e1000000").pow(player.e.points.sub(1000).max(0)));
			else if (player.e.points.gte(940)) return mult.div(buyableEffect("g", 13)).div(new Decimal("1e100000").pow(player.e.points.sub(900).max(0)));
			else return mult.div(buyableEffect("g", 13)).div(new Decimal(1e10).pow(player.e.points.sub(200).max(0)));
		};
		if (hasUpgrade("s", 51)) mult = mult.div(upgradeEffect("s", 51));
		if (hasUpgrade("s", 53)) mult = mult.div(upgradeEffect("s", 53));
		if (player.g.unlocked) mult = mult.div(buyableEffect("g", 13));
		if (hasChallenge("e", 13) && tmp.e.effect[5]) mult = mult.div(tmp.e.effect[5]);
		if (tmp.a.effect[0]) mult = mult.div(tmp.a.effect[0]);
		return mult;
	},
	resetsNothing() {return hasMilestone("g", 36)},
	autoPrestige() {return hasMilestone("g", 36) && player.e.points.gte(60) && player.sp.unlocked},
	effectDescription() {return "of which " + formatWhole(player[this.layer].points.sub(player[this.layer].spent)) + " are unspent"},
	tabFormat() {
		// top text
		let topText = "<div style='height: 25px; padding-top: ";
		if (player.e.points.gte(30) || player.sp.unlocked) {
			topText += "20px'>";
		} else {
			topText += "5px'>";
		};
		if (getClickableState("g", 14)) {
			topText += "Only extra levels";
		} else if (getClickableState("g", 11)) {
			if (getClickableState("g", 13)) topText += "Only base levels " + formatWhole((+getClickableState("g", 11)) * 50) + "+";
			else topText += "Only levels " + formatWhole((+getClickableState("g", 11)) * 50) + "+";
		} else {
			if (getClickableState("g", 13)) topText += "Only base levels";
			else topText += "All levels";
		};
		// stat svg display
		const reduction = (+getClickableState("g", 11)) * 50;
		let max = new Decimal(1);
		if (getClickableState("g", 13)) {
			max = max.add(getBuyableAmount("g", 11).max(getBuyableAmount("g", 12)).max(getBuyableAmount("g", 13)).max(getBuyableAmount("g", 14))).sub(reduction);
		} else if (getClickableState("g", 14)) {
			max = max.add(tmp.g.buyables[11].extra.max(tmp.g.buyables[12].extra).max(tmp.g.buyables[13].extra).max(tmp.g.buyables[14].extra));
		} else {
			max = max.add(getBuyableAmount("g", 11).add(tmp.g.buyables[11].extra).max(getBuyableAmount("g", 12).add(tmp.g.buyables[12].extra)).max(getBuyableAmount("g", 13).add(tmp.g.buyables[13].extra)).max(getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra))).sub(reduction);
		};
		if (max.lt(2)) max = new Decimal(2);
		let statText = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
		statText += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
		statText += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
		let rectMax = max.toNumber();
		if (rectMax >= 16) {
			rectMax = max.div(new Decimal(2).pow(max.log2().sub(3).floor())).toNumber();
		};
		for (let index = 0; index < rectMax; index++) {
			let low = Math.min((index / rectMax * 45) + 5.5, 50);
			let high = Math.max(((rectMax - index) / rectMax * 90) - 1, 0);
			statText += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
		};
		// normal stats
		let stats = (getClickableState("g", 14) ? [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)] : [
			getBuyableAmount("g", 11).sub(reduction).add(1),
			getBuyableAmount("g", 13).sub(reduction).add(1),
			getBuyableAmount("g", 14).sub(reduction).add(1),
			getBuyableAmount("g", 12).sub(reduction).add(1),
		]);
		let statPoint0 = 50 - Math.max(stats[0].div(max).toNumber() * 45 - 0.5, 0);
		let statPoint2 = 50 + Math.max(stats[2].div(max).toNumber() * 45 - 0.5, 0);
		if (!getClickableState("g", 14)) statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
		// extra stats
		if (!getClickableState("g", 13)) {
			stats[0] = stats[0].add(tmp.g.buyables[11].extra);
			stats[1] = stats[1].add(tmp.g.buyables[13].extra);
			stats[2] = stats[2].add(tmp.g.buyables[14].extra);
			stats[3] = stats[3].add(tmp.g.buyables[12].extra);
			statPoint0 = 50 - Math.max(stats[0].div(max).toNumber() * 45 - 0.5, 0);
			statPoint2 = 50 + Math.max(stats[2].div(max).toNumber() * 45 - 0.5, 0);
		};
		statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
		// buyable columns
		let cols = [];
		cols[1] = [
			["display-text", topText + "</div>"],
			["display-text", statText + "</svg>"],
			["row", [
				["clickable", 11],
				["clickable", 12],
				["blank", ["10px", "30px"]],
				["clickable", 13],
				["clickable", 14],
			]],
		];
		if (player.e.points.gte(30) || player.sp.unlocked) {
			cols[0] = [["buyable", 11], ["blank", "10px"], ["toggle", ["g", "autoSTR"]], ["blank", "25px"], ["buyable", 12], ["blank", "10px"], ["toggle", ["g", "autoWIS"]]];
			cols[2] = [["buyable", 13], ["blank", "10px"], ["toggle", ["g", "autoAGI"]], ["blank", "25px"], ["buyable", 14], ["blank", "10px"], ["toggle", ["g", "autoINT"]]];
			cols[1].push(["blank", "15px"], "respec-button");
		} else {
			cols[0] = [["buyable", 11], ["blank", "75px"], ["buyable", 12]];
			cols[2] = [["buyable", 13], ["blank", "75px"], ["buyable", 14]];
		};
		// return
		return [
			"main-display",
			"prestige-button",
			"resource-display",
			["row", [
				["column", cols[0]], ["column", cols[1]], ["column", cols[2]],
			]],
			(player.e.points.gte(30) || player.sp.unlocked ? undefined : "respec-button"),
			"blank",
			"milestones",
		];
	},
	layerShown() {return hasUpgrade("s", 35) || player.g.unlocked},
	hotkeys: [{
		key: "g",
		description: "G: reset for growth points",
		onPress() {if (player.g.unlocked) doReset("g")},
	}],
	doReset(resettingLayer) {
		let keep = ["autoSTR", "autoWIS", "autoAGI", "autoINT"];
		if (player.r.points.gte(6)) keep.push("milestones", "lastMilestone");
		else if (layers[resettingLayer].row <= 3 && player.cb.unlocked) keep.push("milestones", "lastMilestone");
		if (layers[resettingLayer].row > this.row) {
			if (keep.includes("milestones")) {
				layerDataReset("g", keep);
			} else {
				let keepMile = [];
				let keepMileNum = 0;
				if (resettingLayer == "e" && hasChallenge("e", 12)) keepMileNum = 16;
				if (layers[resettingLayer].row == 2 && player.e.points.gte(36)) keepMileNum = 41;
				if (keepMileNum > 0) {
					for (let index = 0; index < player.g.milestones.length; index++) {
						if (player.g.milestones[index] < keepMileNum) keepMile.push(player.g.milestones[index]);
					};
				};
				layerDataReset("g", keep);
				player.g.milestones = keepMile;
			};
		};
	},
	automate() {
		if (player.e.points.gte(30) || player.sp.unlocked) {
			if (player.g.autoSTR && layers.g.buyables[11].canAfford()) layers.g.buyables[11].buy();
			if (player.g.autoWIS && layers.g.buyables[12].canAfford()) layers.g.buyables[12].buy();
			if (player.g.autoAGI && layers.g.buyables[13].canAfford()) layers.g.buyables[13].buy();
			if (player.g.autoINT && layers.g.buyables[14].canAfford()) layers.g.buyables[14].buy();
		};
	},
	componentStyles: {
		"buyable"() {return {"width": "210px", "height": "110px"}},
		"clickable"() {return {'min-height': '30px', 'transform': 'none'}},
	},
	buyables: {
		11: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				let mult = 1;
				if (inChallenge("e", 21)) mult *= 10;
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100).mul(mult);
				return amt.add(1).max(0).mul(mult);
			},
			effectBase() {
				let base = new Decimal(2.5);
				if (hasMilestone("g", 1)) base = base.mul(milestoneEffect("g", 1));
				if (hasMilestone("g", 6)) base = base.mul(milestoneEffect("g", 6));
				if (hasMilestone("g", 11)) base = base.mul(milestoneEffect("g", 11));
				if (hasMilestone("g", 14)) base = base.mul(milestoneEffect("g", 14));
				if (hasMilestone("g", 21)) base = base.mul(milestoneEffect("g", 21));
				if (hasMilestone("g", 27)) base = base.mul(milestoneEffect("g", 27));
				if (hasMilestone("g", 34)) base = base.mul(milestoneEffect("g", 34));
				if (hasMilestone("g", 43)) base = base.mul(milestoneEffect("g", 43));
				if (hasMilestone("g", 54)) base = base.mul(milestoneEffect("g", 54));
				if (hasMilestone("g", 61)) base = base.mul(milestoneEffect("g", 61));
				if (hasMilestone("g", 66)) base = base.mul(milestoneEffect("g", 66));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			title: "(STR)ENGTH",
			display() {return "multiply power gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 54)) max += 90;
				if (hasMilestone("g", 61)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = new Decimal(0);
				if (inChallenge("e", 21)) return extra;
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[0]) extra = extra.add(tmp.e.effect[0]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				if (tmp.cb.effect[2]) extra = extra.mul(tmp.cb.effect[2]);
				return extra.floor();
			},
		},
		12: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				let mult = 1;
				if (inChallenge("e", 21)) mult *= 10;
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100).mul(mult);
				return amt.add(1).max(0).mul(mult);
			},
			effectBase() {
				let base = new Decimal(2);
				if (hasMilestone("g", 0)) base = base.mul(milestoneEffect("g", 0));
				if (hasMilestone("g", 2)) base = base.mul(milestoneEffect("g", 2));
				if (hasMilestone("g", 10)) base = base.mul(milestoneEffect("g", 10));
				if (hasMilestone("g", 17)) base = base.mul(milestoneEffect("g", 17));
				if (hasMilestone("g", 20)) base = base.mul(milestoneEffect("g", 20));
				if (hasMilestone("g", 28)) base = base.mul(milestoneEffect("g", 28));
				if (hasMilestone("g", 33)) base = base.mul(milestoneEffect("g", 33));
				if (hasMilestone("g", 42)) base = base.mul(milestoneEffect("g", 42));
				if (hasMilestone("g", 56)) base = base.mul(milestoneEffect("g", 56));
				if (hasMilestone("g", 62)) base = base.mul(milestoneEffect("g", 62));
				if (hasMilestone("g", 71)) base = base.mul(milestoneEffect("g", 71));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			title: "(WIS)DOM",
			display() {return "multiply stimulation gain by " + format(this.effectBase()) + "<br><br>Effect: " + format(this.effect()) + "x<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()))},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 56)) max += 90;
				if (hasMilestone("g", 62)) max += 750;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = new Decimal(0);
				if (inChallenge("e", 21)) return extra;
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63));
				if (tmp.e.effect[1]) extra = extra.add(tmp.e.effect[1]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				if (tmp.cb.effect[2]) extra = extra.mul(tmp.cb.effect[2]);
				return extra.floor();
			},
		},
		13: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				let mult = 1;
				if (inChallenge("e", 21)) mult *= 10;
				if (amt.gte(100)) return amt.sub(99).mul(10).add(100).mul(mult);
				return amt.add(1).max(0).mul(mult);
			},
			effectBase() {
				if (hasMilestone("g", 46)) {
					let base = new Decimal(milestoneEffect("g", 46));
					if (hasMilestone("g", 51)) base = base.mul(milestoneEffect("g", 51));
					if (hasMilestone("g", 58)) base = base.mul(milestoneEffect("g", 58));
					if (hasMilestone("g", 65)) base = base.mul(milestoneEffect("g", 65));
					return base;
				};
				let base = new Decimal(4);
				if (hasMilestone("g", 4)) base = base.add(milestoneEffect("g", 4));
				if (hasMilestone("g", 5)) base = base.add(milestoneEffect("g", 5));
				if (hasMilestone("g", 9)) base = base.add(milestoneEffect("g", 9));
				if (hasMilestone("g", 16)) base = base.add(milestoneEffect("g", 16));
				if (hasMilestone("g", 22)) base = base.add(milestoneEffect("g", 22));
				if (hasMilestone("g", 30)) base = base.add(milestoneEffect("g", 30));
				return base;
			},
			effect() {return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase())},
			title: "(AGI)LITY",
			display() {
				if (hasMilestone("g", 46)) return "divide growth point<br>requirement by " + formatWhole(this.effectBase()) + "<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				else return "divide growth requirement by " + formatWhole(this.effectBase()) + "<br>(min requirement: 100,000,000)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 46)) max += 840;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 12) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = new Decimal(0);
				if (inChallenge("e", 21)) return extra;
				if (tmp.e.effect[2]) extra = extra.add(tmp.e.effect[2]);
				if (hasMilestone("g", 37)) extra = extra.add(milestoneEffect("g", 37));
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				if (tmp.cb.effect[2]) extra = extra.mul(tmp.cb.effect[2]);
				return extra.floor();
			},
		},
		14: {
			cost() {
				let amt = getBuyableAmount(this.layer, this.id);
				if (hasChallenge("e", 12)) amt = amt.sub(1);
				let mult = 1;
				if (inChallenge("e", 21)) mult *= 10;
				if (amt.gte(100)) return new Decimal(1.5).pow(amt.sub(99).pow(0.5)).mul(100).mul(mult).floor();
				return amt.add(1).max(0).mul(mult);
			},
			maxEffect() {
				if (hasChallenge("e", 11)) {
					return 0.5;
				} else if (hasMilestone("g", 3)) {
					let max = new Decimal(10);
					if (hasMilestone("g", 13)) max = max.add(milestoneEffect("g", 13));
					if (hasMilestone("g", 23)) max = max.add(milestoneEffect("g", 23));
					return max;
				};
			},
			effectBase() {
				if (hasChallenge("e", 11)) {
					let base = new Decimal(0.005);
					if (hasMilestone("g", 26)) base = base.add(milestoneEffect("g", 26));
					return base;
				};
				if (hasMilestone("g", 3)) {
					let base = new Decimal(1);
					if (hasMilestone("g", 7)) base = base.add(milestoneEffect("g", 7));
					if (hasMilestone("g", 12)) base = base.add(milestoneEffect("g", 12));
					return base;
				};
				return new Decimal(5);
			},
			effect() {
				if (hasChallenge("e", 11)) {
					let eff = getBuyableAmount(this.layer, this.id).add(this.extra()).pow(0.75).mul(this.effectBase());
					if (eff.gt(0.375)) eff = eff.sub(0.375).div(2.5).add(0.375);
					return eff.min(this.maxEffect());
				} else if (hasMilestone("g", 3)) return getBuyableAmount(this.layer, this.id).add(this.extra()).mul(this.effectBase()).min(this.maxEffect());
				else return getBuyableAmount(this.layer, this.id).add(this.extra()).pow_base(this.effectBase());
			},
			title: "(INT)ELLECT",
			display() {
				if (hasChallenge("e", 11)) {
					if (this.effect().eq(this.maxEffect())) return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br><br>Effect: +" + format(this.effect()) + " (max)<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else if (this.effect().gt(0.375)) return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br>(effect is softcapped at 0.375)<br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else return "increase the stimulation<br>effect exponent by " + format(this.effectBase()) + "<br>(effective INT is powered to 0.75)<br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				if (hasMilestone("g", 3)) {
					let base = this.effectBase();
					if (base.eq(1)) return "unlock a new stimulation upgrade<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
					else return "unlock " + format(base) + " new stimulation upgrades<br>(maxes at " + formatWhole(this.maxEffect()) + " new upgrades)<br><br>Effect: +" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
				};
				return "divide previous upgrade costs by 5<br>(upgrade costs are rounded down)<br><br>Effect: /" + format(this.effect()) + "<br><br>Cost: " + formatWhole(this.cost()) + " growth points<br><br>Level: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "/" + formatWhole(this.purchaseLimit()) + (this.extra().eq(0) ? "" : " + " + formatWhole(this.extra()));
			},
			purchaseLimit() {
				let max = 100;
				if (hasChallenge("e", 14) && getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) max += 60;
				if (hasMilestone("g", 57)) max += 40;
				if (hasMilestone("g", 63) && player.g.resetTime) max += 800;
				return max;
			},
			canAfford() {return player[this.layer].points.sub(player[this.layer].spent).gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) && !inChallenge("e", 11) && !inChallenge("e", 16)},
			buy() {
				if (!inChallenge("e", 21)) player[this.layer].spent = player[this.layer].spent.add(this.cost());
				addBuyables(this.layer, this.id, getStatBulk());
			},
			extra() {
				let extra = new Decimal(0);
				if (inChallenge("e", 21)) return extra;
				if (hasMilestone("g", 35)) extra = extra.add(milestoneEffect("g", 35));
				if (hasMilestone("g", 41)) extra = extra.add(milestoneEffect("g", 41));
				if (hasMilestone("g", 63) && player.g.resetTime) extra = extra.add(milestoneEffect("g", 63).min(5000));
				if (hasMilestone("g", 69)) extra = extra.add(milestoneEffect("g", 69));
				if (tmp.e.effect[3]) extra = extra.add(tmp.e.effect[3]);
				if (tmp.a.effect[2]) extra = extra.add(tmp.a.effect[2]);
				if (tmp.cb.effect[2]) extra = extra.mul(tmp.cb.effect[2]);
				return extra.floor();
			},
		},
		respec() {
			if (getBuyableAmount("g", 11).gte(100) && getBuyableAmount("g", 12).gte(100) && getBuyableAmount("g", 13).gte(100) && getBuyableAmount("g", 14).gte(100)) {
				setBuyableAmount("g", 11, new Decimal(100));
				setBuyableAmount("g", 12, new Decimal(100));
				setBuyableAmount("g", 13, new Decimal(100));
				setBuyableAmount("g", 14, new Decimal(100));
				if (hasChallenge("e", 12)) player.g.spent = new Decimal(19800);
				else player.g.spent = new Decimal(20200);
				if (getClickableState("g", 11) > 2) setClickableState("g", 11, 2);
			} else {
				setBuyableAmount("g", 11, new Decimal(0));
				setBuyableAmount("g", 12, new Decimal(0));
				setBuyableAmount("g", 13, new Decimal(0));
				setBuyableAmount("g", 14, new Decimal(0));
				player.g.spent = new Decimal(0);
				setClickableState("g", 11, 0);
			};
			doReset("g", true, true);
		},
		respecText: "respec growth points",
	},
	clickables: {
		11: {
			display() {return "<h2>-50</h2>"},
			canClick() {return getClickableState("g", 11) > 0 && !getClickableState("g", 14)},
			onClick() {setClickableState("g", 11, (+getClickableState("g", 11)) - 1)},
			onHold() {setClickableState("g", 11, (+getClickableState("g", 11)) - 1)},
			style: {"width": "45px", "border-radius": "10px 0 0 10px"},
		},
		12: {
			display() {return "<h2>+50</h2>"},
			canClick() {
				let amt = new Decimal(((+getClickableState("g", 11)) + 1) * 50);
				return getBuyableAmount("g", 11).gte(amt) && getBuyableAmount("g", 12).gte(amt) && getBuyableAmount("g", 13).gte(amt) && getBuyableAmount("g", 14).gte(amt) && !getClickableState("g", 14);
			},
			onClick() {setClickableState("g", 11, (+getClickableState("g", 11)) + 1)},
			onHold() {setClickableState("g", 11, (+getClickableState("g", 11)) + 1)},
			style: {"width": "45px", "border-radius": "0 10px 10px 0"},
		},
		13: {
			display() {return (getClickableState("g", 13) ? "Both" : "Only Base")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 13, !getClickableState("g", 13));
				if (getClickableState("g", 13)) setClickableState("g", 14, false);
			},
			style: {"width": "40px", "border-radius": "10px 0 0 10px"},
		},
		14: {
			display() {return (getClickableState("g", 14) ? "Both" : "Only Extra")},
			canClick() {return tmp.g.buyables[11].extra.gte(1) || tmp.g.buyables[12].extra.gte(1) || tmp.g.buyables[13].extra.gte(1) || tmp.g.buyables[14].extra.gte(1)},
			onClick() {
				setClickableState("g", 14, !getClickableState("g", 14));
				if (getClickableState("g", 14)) setClickableState("g", 13, false);
			},
			style: {"width": "40px", "border-radius": "0 10px 10px 0"},
		},
	},
	milestones: {
		0: {
			requirement: 6,
			requirementDescription: "WIS enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
		},
		1: {
			requirement: 9,
			requirementDescription: "STR enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.75).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		2: {
			requirement: 12,
			requirementDescription: "WIS enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.45).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		3: {
			requirement: 21,
			requirementDescription: "INT enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "change the base effect of INT<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		4: {
			requirement: 40,
			requirementDescription: "AGI enhancement I",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		5: {
			requirement: 48,
			requirementDescription: "AGI enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase the base effect of AGI by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		6: {
			requirement: 66,
			requirementDescription: "STR enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		7: {
			requirement: 70,
			requirementDescription: "INT enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.25},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.25<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		8: {
			requirement: 90,
			requirementDescription: "Growth enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				if (player.cb.unlocked) return "effect overriden by conscious beings<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (inChallenge("e", 21)) return "effect overriden by the 10th retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (hasChallenge("e", 11)) return "keep all stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else if (player.e.unlocked) return "keep the first fifteen stimulation upgrades on growth resets<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock bulk growth<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		9: {
			requirement: 101,
			requirementDescription: "AGI enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 8},
			effectDescription() {return "increase the base effect of AGI by 8<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		10: {
			requirement: 121,
			requirementDescription: "WIS enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.25).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		11: {
			requirement: 140,
			requirementDescription: "STR enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.5).add(1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		12: {
			requirement: 150,
			requirementDescription: "INT enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.75},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the base effect of INT by 0.75<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		13: {
			requirement: 166,
			requirementDescription: "INT enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		14: {
			requirement: 196,
			requirementDescription: "STR enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		15: {
			requirement: 300,
			requirementDescription: "Evolution enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.e.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.e.unlocked},
		},
		16: {
			requirement: 400,
			requirementDescription: "AGI enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 16},
			effectDescription() {return "increase the base effect of AGI by 16<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		17: {
			requirement: 420,
			requirementDescription: "WIS enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.1).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		18: {
			requirement: 488,
			requirementDescription: "Growth enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease base growth requirement by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		19: {
			requirement: 525,
			requirementDescription: "Evolution enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5},
			effectDescription() {return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		20: {
			requirement: 575,
			requirementDescription: "WIS enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).log10().mul(0.15).add(1)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		21: {
			requirement: 640,
			requirementDescription: "STR enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		22: {
			requirement: 715,
			requirementDescription: "AGI enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 32},
			effectDescription() {return "increase the base effect of AGI by 32<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		23: {
			requirement: 788,
			requirementDescription: "INT enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 5},
			effectDescription() {
				if (hasChallenge("e", 11)) return "effect overriden by the 1st retrogression<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "increase the max effect of INT by 5<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		24: {
			requirement: 1725,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return hasChallenge("e", 11) ? 1.5 : 1},
			effectDescription() {
				if (hasChallenge("e", 11)) return "divide evolution requirement by 1.5<br>Req: " + formatWhole(this.requirement) + " growth points";
				else return "unlock something new in the evolution layer<br>Req: " + formatWhole(this.requirement) + " growth points";
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		25: {
			requirement: 2000,
			requirementDescription: "Growth enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.07},
			effectDescription() {return "decrease base growth requirement by 0.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		26: {
			requirement: 2666,
			requirementDescription: "INT enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.003},
			effectDescription() {return "increase the base effect of INT by 0.003<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		27: {
			requirement: 3725,
			requirementDescription: "STR enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.075)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		28: {
			requirement: 4050,
			requirementDescription: "WIS enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.055)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		29: {
			requirement: 4960,
			requirementDescription: "Evolution enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.425},
			effectDescription() {return "divide evolution requirement by 1.425<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		30: {
			requirement: 10000,
			requirementDescription: "AGI enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 935},
			effectDescription() {return "increase the base effect of AGI by 935<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		31: {
			requirement: 25300,
			requirementDescription: "Growth enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		32: {
			requirement: 26400,
			requirementDescription: "Evolution enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.25},
			effectDescription() {return "divide evolution requirement by 1.25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		33: {
			requirement: 29450,
			requirementDescription: "WIS enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.066)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		34: {
			requirement: 32000,
			requirementDescription: "STR enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.1)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		35: {
			requirement: 34550,
			requirementDescription: "INT enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		36: {
			requirement: 47175,
			requirementDescription: "Growth enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "growth resets (without respec) no longer reset anything<br>and decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		37: {
			requirement: 50950,
			requirementDescription: "AGI enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 50},
			effectDescription() {return "increase extra AGI levels by 50<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		38: {
			requirement: 53333,
			requirementDescription: "Growth enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01},
			effectDescription() {return "decrease base growth requirement by 0.01<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		39: {
			requirement: 55155,
			requirementDescription: "Evolution enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.07},
			effectDescription() {return "divide evolution requirement by 1.07<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		40: {
			requirement: 64750,
			requirementDescription: "Acclimation enhancement I",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {
				let text = "unlock a new layer";
				if (player.a.unlocked) text += " (already unlocked)";
				text += "<br>Req: " + formatWhole(this.requirement) + " growth points";
				return text;
			},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.a.unlocked},
		},
		41: {
			requirement: 77555,
			requirementDescription: "INT enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 2},
			effectDescription() {return "increase extra INT levels by 2<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		42: {
			requirement: 85555,
			requirementDescription: "WIS enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.03)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		43: {
			requirement: 164000,
			requirementDescription: "STR enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.div(1000).add(1).pow(0.11)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		44: {
			requirement: 190000,
			requirementDescription: "Growth enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.005},
			effectDescription() {return "decrease base growth requirement by 0.005<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		45: {
			requirement: 236250,
			requirementDescription: "Evolution enhancement VI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.5666},
			effectDescription() {return "divide evolution requirement by 1.5666<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		46: {
			requirement: 238000,
			requirementDescription: "AGI enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e10},
			effectDescription() {return "increase the base effect of AGI to 1e10<br>and increase its maximum by 840<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		47: {
			requirement: 254300,
			requirementDescription: "Evolution enhancement VII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.487},
			effectDescription() {return "divide evolution requirement by 1.487<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		48: {
			requirement: 256000,
			requirementDescription: "Acclimation enhancement II",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		49: {
			requirement: 258425,
			requirementDescription: "Growth enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.1858},
			effectDescription() {return "decrease base growth requirement by 0.1858<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		50: {
			requirement: 349333,
			requirementDescription: "Evolution enhancement VIII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05732},
			effectDescription() {return "decrease base evolution requirement by 0.05732<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		51: {
			requirement: 352750,
			requirementDescription: "AGI enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e15},
			effectDescription() {return "multiply the base effect of AGI by 1e15<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		52: {
			requirement: 400450,
			requirementDescription: "Acclimation enhancement III",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.75},
			effectDescription() {return "divide acclimation requirement by 1.75<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		53: {
			requirement: 419625,
			requirementDescription: "Growth enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.05},
			effectDescription() {return "decrease base growth requirement by 0.05<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		54: {
			requirement: 467850,
			requirementDescription: "STR enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e20).add(1).pow(0.555)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		55: {
			requirement: 664750,
			requirementDescription: "Evolution enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.045875},
			effectDescription() {return "decrease base evolution requirement by 0.045875<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		56: {
			requirement: 842525,
			requirementDescription: "WIS enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e10).add(1).pow(0.459)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 90<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		57: {
			requirement: 1957700,
			requirementDescription: "INT enhancement IX",
			popupTitle: "Enhancement Acquired!",
			effectDescription() {return "increase the maximum of INT by 40<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		58: {
			requirement: 2459000,
			requirementDescription: "AGI enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1e25},
			effectDescription() {return "multiply the base effect of AGI by 1e25<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		59: {
			requirement: 2769360,
			requirementDescription: "Growth enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.12},
			effectDescription() {return "decrease base growth requirement by 0.12<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		60: {
			requirement: 8658450,
			requirementDescription: "Acclimation enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 1.222},
			effectDescription() {return "divide acclimation requirement by 1.222<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		61: {
			requirement: 14606750,
			requirementDescription: "STR enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(2e20).add(1).pow(2.5)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		62: {
			requirement: 20968222,
			requirementDescription: "WIS enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1.5177e20).add(1).pow(17.77)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>and increase its maximum by 750<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		63: {
			requirement: 68729900,
			requirementDescription: "INT enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return getBuyableAmount("g", 14).add(tmp.g.buyables[14].extra).sub(248).div(2).floor().max(0)},
			effectDescription() {return "every 2 INT past 248 gives 1 extra STR, WIS, and INT<br>and increase the maximum of INT by 800<br>(extra INT levels from this enhancement max at 5,000)<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		64: {
			requirement: 102912250,
			requirementDescription: "Evolution enhancement X",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.04762644},
			effectDescription() {return "decrease base evolution requirement by 0.04762644<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.sp.unlocked},
		},
		65: {
			requirement: 122206000,
			requirementDescription: "AGI enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return new Decimal("1e7000")},
			effectDescription() {return "multiply the base effect of AGI by 1e7000<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		66: {
			requirement: 325223444,
			requirementDescription: "STR enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1e10).add(1).pow(39.3393)},
			effectDescription() {return "multiply the base effect of STR based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		67: {
			requirement: 471368666,
			requirementDescription: "Acclimation enhancement IV",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.142295},
			effectDescription() {return "decrease base acclimation requirement by 0.142295<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		68: {
			requirement: 500472500,
			requirementDescription: "Growth enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.09912925},
			effectDescription() {return "decrease base growth requirement by 0.09912925<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		69: {
			requirement: 1450790500,
			requirementDescription: "INT enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.add(1).pow(0.40495).sub(1).floor()},
			effectDescription() {return "increase extra INT levels based on growth points<br>Effect: +" + formatWhole(this.effect()) + "<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		70: {
			requirement: 2865557000,
			requirementDescription: "Evolution enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.0273939},
			effectDescription() {return "decrease base evolution requirement by 0.0273939<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		71: {
			requirement: 3632610555,
			requirementDescription: "WIS enhancement XI",
			popupTitle: "Enhancement Acquired!",
			effect() {return player.g.points.mul(1.495575e10).add(1).pow(32)},
			effectDescription() {return "multiply the base effect of WIS based on growth points<br>Effect: " + format(this.effect()) + "x<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		72: {
			requirement: 10812520000,
			requirementDescription: "Acclimation enhancement V",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.042},
			effectDescription() {return "decrease base acclimation requirement by 0.042<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		73: {
			requirement: 38377554000,
			requirementDescription: "Evolution enhancement XII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.01022},
			effectDescription() {return "decrease base evolution requirement by 0.01022<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
		74: {
			requirement: 59805129250,
			requirementDescription: "Growth enhancement XII",
			popupTitle: "Enhancement Acquired!",
			effect() {return 0.225024093},
			effectDescription() {return "decrease base growth requirement by 0.225024093<br>Req: " + formatWhole(this.requirement) + " growth points"},
			done() {return player.g.points.gte(this.requirement)},
			unlocked() {return hasMilestone("g", this.id - 1) || player.cb.unlocked},
		},
	},
});
