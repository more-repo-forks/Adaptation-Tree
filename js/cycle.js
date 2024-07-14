const cycleUnlocks = [[
	[25, "domination resets (without respec) no longer reset anything<br>you automatically claim potential domination points"],
	[45, "growth resets (without respec) no longer reset anything<br>you automatically claim potential growth points"],
	[75, "you generate an additional 100% of potential stimulations per second"],
	[100, "the first war effect is improved", null, 255],
	[125, () => "you bulk 10x <b>Influence tickspeed</b>" + (player.cy.unlocks[0] >= 5 ? "" : "<br>(this resets <b>Influence tickspeed</b> amount)"), () => setBuyableAmount("ex", 21, new Decimal(0))],
	[155, "focus+ can be allocated to both species and domination<br>focus+ points are automatically allocated"],
	[180, "you bulk 10x stats from rows 3 and below"],
	[225, "unlock an additional effect for settlers"],
	[255, "the first war effect is improved further"],
	[300, "coming soon"],
]];

addLayer("cy", {
	name: "Cycle",
	symbol: "CY",
	position: 0,
	branches: ["co", "r", "l"],
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		unlocks: [],
	}},
	color: "#EE7770",
	nodeStyle() {if (tmp.cy.canReset || player.cy.unlocked) return {"background": "border-box linear-gradient(to right, #116022, #EE7770, #E03330)"}},
	resource: "cycles",
	row: 6,
	baseResource: "revolutions",
	baseAmount() {return player.r.points},
	requires: new Decimal(200),
	type: "static",
	base: 1.5,
	exponent: 1,
	roundUpCost: true,
	canBuyMax() {return false},
	resetDescription: "Begin for ",
	gainMult() {
		let mult = new Decimal(1);
		return mult;
	},
	effect() { return [
		player.cy.points,
		player.cy.points.div(10).add(1),
	]},
	effectDescription() {return "which are increasing continent and leader amounts in their effects by +" + formatWhole(tmp.cy.effect[0]) + " and directly multiplying revolution gain by " + format(tmp.cy.effect[1]) + "x"},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text", "After beginning 1 time, you can always bulk ecosystems, revolutions, expansion points, wars, continents, leaders, and territories.<br><br>The above extra effect will not go away even if this layer is reset."],
		"blank",
		["microtabs", "cycles"],
		"blank",
	],
	layerShown() {return hasMilestone("d", 59) || player.cy.unlocked},
	hotkeys: [{
		key: "y",
		description: "Y: reset for cycles",
		onPress() {if (player.cy.unlocked) doReset("cy")},
	}],
	doReset(resettingLayer) {
		if (layers[resettingLayer].row <= this.row) return;
		let keep = [];
		layerDataReset("cy", keep);
	},
	update(diff) {
		for (let cycle = 0; cycle < player.cy.points.toNumber() && cycle < cycleUnlocks.length; cycle++) {
			if (cycleUnlocks[cycle][player.cy.unlocks[cycle]] && player.r.points.gte(cycleUnlocks[cycle][player.cy.unlocks[cycle]][0])) {
				if (cycleUnlocks[cycle][player.cy.unlocks[cycle]][2]) cycleUnlocks[cycle][player.cy.unlocks[cycle]][2]();
				player.cy.unlocks[cycle]++;
			};
		};
	},
	componentStyles: {
		"prestige-button"() {if (tmp.cy.canReset && tmp.cy.nodeStyle) return tmp.cy.nodeStyle},
		"microtabs"() {return {"box-sizing": "border-box", "width": "fit-content", "max-width": "calc(100% - 34px)", "border": "2px solid #EE7770", "padding": "8.5px"}},
		"tab-button"() {return {"margin": "8.5px"}},
	},
	microtabs: {
		cycles: {
			"The First Cycle": {
				content: [
					["display-text", () => {
						let text = "";
						for (let index = 0; index <= player.cy.unlocks[0] && index < cycleUnlocks[0].length; index++) {
							if (cycleUnlocks[0][index][3] && player.r.points.gte(cycleUnlocks[0][index][3])) continue;
							if (index > 0) text += (index >= player.cy.unlocks[0] ? "<br><br>" : "<br>");
							if (index >= player.cy.unlocks[0]) text += "At " + formatWhole(cycleUnlocks[0][index][0]) + " revolutions:<br>";
							text += (typeof cycleUnlocks[0][index][1] == "function" ? cycleUnlocks[0][index][1]() : cycleUnlocks[0][index][1]);
						};
						return text;
					}],
				],
				style: {"margin": "8.5px"},
			},
		},
	}
});

addNode("blank", {
	symbol: "EM",
	branches: ["l", "ex", "t"],
	position: 1,
	nodeStyle: {"margin": "0 10px 0 10px", "border-radius": "50%"},
	tooltipLocked() {return "coming soon!"},
	row: 6,
	layerShown() {return hasMilestone("d", 59)},
});
