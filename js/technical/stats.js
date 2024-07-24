const statAutoNames = {
	g: ["autoSTR", "autoWIS", "autoAGI", "autoINT"],
	a: ["autoCRA", "autoFER", "autoANA", "autoSOV"],
	d: ["autoFOC", "autoSPE", "autoCLI", "autoDOM"],
};

function getStatDisplay(layer, autoUnlocked = false, desc = "") {
	// top text
	let topText = "<div style='height: 25px; padding-top: ";
	if (autoUnlocked) topText += "20px'>";
	else topText += "5px'>";
	if (getClickableState(layer, 14)) {
		topText += "Only extra levels";
	} else if (getClickableState(layer, 11)) {
		if (getClickableState(layer, 13)) topText += "Only base levels " + formatWhole((getClickableState(layer, 11) || 0) * 50) + "+";
		else topText += "Only levels " + formatWhole((getClickableState(layer, 11) || 0) * 50) + "+";
	} else {
		if (getClickableState(layer, 13)) topText += "Only base levels";
		else topText += "All levels";
	};
	// stat svg display
	const reduction = (getClickableState(layer, 11) || 0) * 50;
	let max = new Decimal(1);
	if (getClickableState(layer, 13)) max = max.add(getBuyableAmount(layer, 11).max(getBuyableAmount(layer, 12)).max(getBuyableAmount(layer, 13)).max(getBuyableAmount(layer, 14))).sub(reduction);
	else if (getClickableState(layer, 14)) max = max.add(tmp[layer].buyables[11].extra.max(tmp[layer].buyables[12].extra).max(tmp[layer].buyables[13].extra).max(tmp[layer].buyables[14].extra));
	else max = max.add(getBuyableAmount(layer, 11).add(tmp[layer].buyables[11].extra).max(getBuyableAmount(layer, 12).add(tmp[layer].buyables[12].extra)).max(getBuyableAmount(layer, 13).add(tmp[layer].buyables[13].extra)).max(getBuyableAmount(layer, 14).add(tmp[layer].buyables[14].extra))).sub(reduction);
	if (max.lt(2)) max = new Decimal(2);
	let statText = "<svg viewBox='0 0 100 100' style='width: 200px; height: 200px'>";
	statText += "<line x1='6' y1='6' x2='94' y2='94' fill='none' stroke='#404040'/>";
	statText += "<line x1='6' y1='94' x2='94' y2='6' fill='none' stroke='#404040'/>";
	let rectMax = max.toNumber();
	if (rectMax >= 16) rectMax = max.div(new Decimal(2).pow(max.log2().sub(3).floor())).toNumber();
	for (let index = 0; index < rectMax; index++) {
		let low = Math.min((index / rectMax * 45) + 5.5, 50);
		let high = Math.max(((rectMax - index) / rectMax * 90) - 1, 0);
		statText += "<rect x='" + low + "' y='" + low + "' width=" + high + " height='" + high + "' rx='1' ry='1' fill='none' stroke='#808080'/>";
	};
	// normal stats
	let stats = (getClickableState(layer, 14) ? [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)] : [
		getBuyableAmount(layer, 11).sub(reduction).add(1),
		getBuyableAmount(layer, 13).sub(reduction).add(1),
		getBuyableAmount(layer, 14).sub(reduction).add(1),
		getBuyableAmount(layer, 12).sub(reduction).add(1),
	]);
	let statPoint0 = 50 - Math.max(stats[0].div(max).toNumber() * 45 - 0.5, 0);
	let statPoint2 = 50 + Math.max(stats[2].div(max).toNumber() * 45 - 0.5, 0);
	if (!getClickableState(layer, 14)) statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
	// extra stats
	if (!getClickableState(layer, 13)) {
		stats[0] = stats[0].add(tmp[layer].buyables[11].extra);
		stats[1] = stats[1].add(tmp[layer].buyables[13].extra);
		stats[2] = stats[2].add(tmp[layer].buyables[14].extra);
		stats[3] = stats[3].add(tmp[layer].buyables[12].extra);
		statPoint0 = 50 - Math.max(stats[0].div(max).toNumber() * 45 - 0.5, 0);
		statPoint2 = 50 + Math.max(stats[2].div(max).toNumber() * 45 - 0.5, 0);
	};
	statText += "<polyline points='" + statPoint0 + "," + statPoint0 + " " + (50 + Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 - Math.max(stats[1].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint2 + "," + statPoint2 + " " + (50 - Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + "," + (50 + Math.max(stats[3].div(max).toNumber() * 45 - 0.5, 0)) + " " + statPoint0 + "," + statPoint0 + "' fill='#ffffff40' stroke='#ffffff' stroke-linejoin='round' stroke-linecap='round'/>";
	// buyable columns
	let cols = [[], [["display-text", topText + "</div>"], ["display-text", statText + "</svg>"]], []];
	if (!tmp[layer].clickables[11]) cols[1].push(["row", [["clickable", 13], ["clickable", 14]]]);
	else cols[1].push(["row", [["clickable", 11], ["clickable", 12], ["blank", ["10px", "30px"]], ["clickable", 13], ["clickable", 14]]]);
	if (autoUnlocked) {
		cols[0] = [["buyable", 11], ["blank", "10px"], ["toggle", [layer, statAutoNames[layer][0]]], ["blank", "25px"], ["buyable", 12], ["blank", "10px"], ["toggle", [layer, statAutoNames[layer][1]]]];
		cols[2] = [["buyable", 13], ["blank", "10px"], ["toggle", [layer, statAutoNames[layer][2]]], ["blank", "25px"], ["buyable", 14], ["blank", "10px"], ["toggle", [layer, statAutoNames[layer][3]]]];
		cols[1].push(["blank", "15px"], "respec-button");
	} else {
		cols[0] = [["buyable", 11], ["blank", "75px"], ["buyable", 12]];
		cols[2] = [["buyable", 13], ["blank", "75px"], ["buyable", 14]];
	};
	// return
	let tab = ["main-display", "prestige-button", "resource-display"];
	if (desc.length) tab.push(["display-text", desc], "blank");
	tab.push(["row", [["column", cols[0]], ["column", cols[1]], ["column", cols[2]]]]);
	if (!autoUnlocked) tab.push("respec-button");
	tab.push("blank", "milestones", "blank");
	return tab;
};
