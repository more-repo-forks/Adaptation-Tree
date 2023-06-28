// booster color: #6E64C4
// super booster color: #504899
// generator color: #A3D9A5
// super generator color: #248239

addLayer("g", {
	name: "Generators",
	symbol: "G",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#A3D9A5",
	requires: new Decimal(100000),
	resource: "generator power",
	row: 0,
	effect() {return player.g.points.add(1).pow(0.5)},
	effectDescription() {return "which is multiplying point gain by " + format(tmp.g.effect) + "x"},
	/* hotkeys: [
		{key: "g", description: "G: buy the selected generator", onPress(){ do stuff }},
	], */
	layerShown() {return true},
	doReset(resettingLayer) {
		let keep = [];
		layerDataReset("g", keep);
	},
});
