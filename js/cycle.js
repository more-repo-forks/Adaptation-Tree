const cycleUnlocks = [[
	[25, "domination resets (without respec) no longer reset anything<br>you automatically claim potential domination points"],
	[45, "growth resets (without respec) no longer reset anything<br>you automatically claim potential growth points"],
	[75, "you generate an additional 100% of potential stimulations per second"],
	[100, "the first war effect is improved", null, 9],
	[125, () => "you bulk 10x <b>Influence tickspeed</b>" + (player.cy.unlocks[0] >= 5 ? "" : "<br>(this resets <b>Influence tickspeed</b> amount)"), () => setBuyableAmount("ex", 21, new Decimal(0))],
	[155, "focus+ can be allocated to both species and domination<br>focus+ points are automatically allocated"],
	[180, "you bulk 10x stats from rows 3 and below"],
	[225, "unlock an additional effect for settlers"],
	[255, "the first war effect is improved further"],
], [
	[50, "you keep growth enhancements on all resets"],
	[100, "you keep stimulation upgrades on all resets"],
	[150, "the 10th hybridization is auto-maxed"],
	[200, "the row 6 [10 resets] effects unlock at 6 resets"],
	[250, "reduce the battle enhancement costs by 1", null, 10],
	[275, () => "you bulk 10x <b>Influence empowerment</b>" + (player.cy.unlocks[1] >= 6 ? "" : "<br>(this resets <b>Influence empowerment</b> amount)"), () => setBuyableAmount("ex", 22, new Decimal(0))],
	[300, "improve the first cycle effect"],
	[325, "you keep ANACHRONISM completions on all resets"],
	[350, "you keep retrogression completions on all resets"],
	[375, () => "reduce the battle enhancement costs by " + (player.cy.unlocks[1] >= 10 ? 2 : 1)],
	[400, "improve the second and fourth ecosystem effects"],
], [
	[111, "ecosystem resets (that are not in ANACHRONISM) no longer reset anything<br>you automatically claim potential ecosystems"],
	[222, "revolution resets no longer reset anything<br>you automatically claim potential revolutions"],
	[333, "expansion resets no longer reset anything<br>you automatically claim potential expansion points"],
	[444, "war resets (without respec) no longer reset anything<br>you automatically claim potential wars"],
	[555, "improve the first territory effect"],
]];

function cycleUnlockText(tab) {
	let text = "";
	for (let index = 0; index <= player.cy.unlocks[tab] && index < cycleUnlocks[tab].length; index++) {
		if (cycleUnlocks[tab][index][3] && player.cy.unlocks[tab] >= cycleUnlocks[tab][index][3]) continue;
		if (index > 0) text += (index >= player.cy.unlocks[tab] ? "<br><br>" : "<br>");
		if (index >= player.cy.unlocks[tab]) text += "At " + formatWhole(cycleUnlocks[tab][index][0]) + " revolutions:<br>";
		text += (typeof cycleUnlocks[tab][index][1] == "function" ? cycleUnlocks[tab][index][1]() : cycleUnlocks[tab][index][1]);
	};
	return text;
};

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
		player.cy.points.mul(player.cy.unlocks[1] >= 7 ? 2 : 1),
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
						if (player.cy.points.gte(1)) return cycleUnlockText(0);
						else return "LOCKED";
					}],
				],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(1)},
			},
			"The Second Cycle": {
				content: [
					["display-text", () => {
						if (player.cy.points.gte(2)) return cycleUnlockText(1);
						else return "LOCKED";
					}],
				],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(2)},
			},
			"The Third Cycle": {
				content: [
					["display-text", () => {
						if (player.cy.points.gte(3)) return cycleUnlockText(2);
						else return "LOCKED";
					}],
				],
				style: {"margin": "8.5px"},
				unlocked() {return player.cy.points.gte(3)},
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
