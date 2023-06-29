// booster color: #6E64C4
// super booster color: #504899
// generator color: #A3D9A5
// super generator color: #248239

const generatorCostBase = {
	101: 5,
	201: 100,
	202: 500,
};

const generatorName = {
	101: "Basic Generator",
	201: "Generator Generator 1",
	202: "Generator Generator 2",
};

function generatorCost(id) {
	let bought = player.g.grid[id].bought;
	return new Decimal(generatorCostBase[id]).pow(bought ** 1.25 + 1);
};

addLayer("g", {
	name: "Generators",
	symbol: "G",
	position: 0,
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#A3D9A5",
	resource: "generator power",
	row: 0,
	effect() {return player.g.points.add(1).pow(0.75)},
	effectDescription() {return "which is multiplying point gain by " + format(tmp.g.effect) + "x"},
	tabFormat: [
		"main-display",
		"grid",
	],
	layerShown() {return true},
	doReset(resettingLayer) {
		let keep = [];
		layerDataReset("g", keep);
	},
	update(diff) {
		player.g.points = player.g.points.add(gridEffect("g", 101).mul(diff));
		for (let id in player.g.grid) {
			if (gridEffect("g", id).gt(0)) {
				let gen = new Decimal(0);
				let extra = new Decimal(0);
				let checkId = Number(id) + 100;
				if (gridEffect("g", checkId).gt(0)) {
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				checkId = Number(id) + 101;
				if (gridEffect("g", checkId).gt(0)) {
					gen = gen.mul(gridEffect("g", checkId));
					extra = extra.add(gridEffect("g", checkId));
				};
				gen = gen.max(extra);
				player.g.grid[id].amount = player.g.grid[id].amount.add(gen.mul(diff));
			};
		};
	},
	componentStyles: {
		"gridable"() {return {"width": "100px", "height": "100px"}},
	},
	grid: {
		rows: 2,
		cols: 2,
		getStartData(id) {
			return {
				bought: 0,
				amount: new Decimal(0),
			};
		},
		getUnlocked(id) {
			return id % 100 < id / 100;
		},
		getCanClick(data, id) {
			return player.points.gte(generatorCost(id));
		},
		onClick(data, id) {
			player.points = player.points.sub(generatorCost(id));
			player.g.grid[id].bought++;
			player.g.grid[id].amount = player.g.grid[id].amount.add(1);
		},
		getTitle(data, id) {
			return generatorName[id];
		},
		getDisplay(data, id) {
			return "<br>Amount: " + format(data.amount) + " (" + formatWhole(data.bought) + ")<br><br>Cost: " + format(generatorCost(id)) + " points";
		},
		getEffect(data, id) {
			if (!data) return new Decimal(0);
			return data.amount.mul(data.bought);
		},
	},
});
