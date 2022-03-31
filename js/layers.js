addLayer("1", {
    name: "Main Tab",
    symbol: "M",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        creations: new Decimal(0),
        creationsR: new Decimal(0),
        creationsT: new Decimal(0),
        clickValue: new Decimal(1),
        clickValueBest: new Decimal(1),
        clickValueBestT: new Decimal(1),
        clickTotalValue: new Decimal(0),
        clickTotalValueBest: new Decimal(0),
        clickTotalValueBestT: new Decimal(0),
        clickTotalValueTotal: new Decimal(0),
        clickTotalValueTotalT: new Decimal(0),
        clickTimes: new Decimal(0),
        clickTimesBest: new Decimal(0),
        clickTimesBestT: new Decimal(0),
        clickTimesTotal: new Decimal(0),
        clickTimesTotalT: new Decimal(0),
        gemMult: new Decimal(1),
    }},
    color: "#CCCCCC",
    requires: new Decimal(100000),
    resource: "gems",
    baseResource: "coins",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    effect() {return player['1'].points.mul(player['1'].gemMult).mul(0.01).add(1)},
    effectDescription() {return "which effect is increasing all production by " + player['1'].gemMult + "% each, for a total of " + format(tmp['1'].effect) + 'x'},
    hotkeys: [
        {key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip() {return "Main Tab"},
    doReset(resettingLayer) {
        let keep1 = ["creationsT", "clickValueBestT", "clickTotalValueBestT", "clickTotalValueTotalT", "clickTimesBestT", "clickTimesTotalT"];
        let keep2 = ["manatotalT", "maxmanabestT", "manaregenbestT", "taxcastsT", "callcastsT", "holycastsT", "frenzycastsT"];
        player.fairyCoins = new Decimal(0);
        player.elfCoins = new Decimal(0);
        player.angelCoins = new Decimal(0);
        player.goblinCoins = new Decimal(0);
        player.undeadCoins = new Decimal(0);
        player.demonCoins = new Decimal(0);
        player._FC = new Decimal(0);
        player.FCbest = new Decimal(0);
        player.FCtotal = new Decimal(0);
        player.best = new Decimal(0);
        player.total = new Decimal(0);
        if (resettingLayer == '1') keep1.push("points", "creationsR", "clickValueBest", "clickTotalValueBest", "clickTotalValueTotal", "clickTimesBest", "clickTimesTotal");
        if (resettingLayer == '1') keep2.push("manatotalR", "maxmanabest", "manaregenbest", "taxcastsR", "callcastsR", "holycastsR", "frenzycastsR");
        layerDataReset('1', keep1);
        layerDataReset('2', keep2);
    },
    update() {
        let clickGain = new Decimal(1);
        let pointGain = getPointGen();
        let FCchance = new Decimal(2.5);
        // click value
        if (getBuyableAmount('1', 11).gt(0)) clickGain = clickGain.add(getBuyableAmount('1', 11).mul(buyableEffect('1', 11)));
        if (hasUpgrade('1', 1033)) clickGain = clickGain.mul(upgradeEffect('1', 1033));
        clickGain = clickGain.mul(tmp['1'].effect);
        if (hasUpgrade('1', 11) && getClickableState('2', 13) == "ON") clickGain = clickGain.mul(clickableEffect('2', 13));
        player['1'].clickValue = clickGain;
        // best coins
        if (player.points.gt(player.best)) player.best = player.points;
	    if (player.points.gt(player.bestR)) player.bestR = player.points;
	    if (player.points.gt(player.bestT)) player.bestT = player.points;
	    // total coins
        player.total = new Decimal(player.total.add(pointGain));
	    player.totalR = new Decimal(player.totalR.add(pointGain));
	    player.totalT = new Decimal(player.totalT.add(pointGain));
        // FC chance
        if (getBuyableAmount('1', 13).gt(0)) FCchance = FCchance.add(getBuyableAmount('1', 13).mul(buyableEffect('1', 13).div(10)));
        if (hasUpgrade('1', 1033)) FCchance = FCchance.add(upgradeEffect('1', 1033).mul(3));
        if (hasUpgrade('1', 1061)) FCchance = FCchance.add(upgradeEffect('1', 1061));
        if (hasUpgrade('1', 1063)) FCchance = FCchance.add(upgradeEffect('1', 1063));
        if (hasUpgrade('1', 2011)) FCchance = FCchance.add(upgradeEffect('1', 2011));
        player.FCchance = new Decimal(FCchance);
        // FC bests
        if (player.FCchance.gt(player.FCchancebest)) player.FCchancebest = player.FCchance;
        if (player.FCchance.gt(player.FCchancebestT)) player.FCchancebestT = player.FCchance;
        if (player._FC.gt(player.FCbest)) player.FCbest = player._FC;
        if (player._FC.gt(player.FCbestR)) player.FCbestR = player._FC;
        if (player._FC.gt(player.FCbestT)) player.FCbestT = player._FC;
        // total creations
        player['1'].creations = getBuyableAmount('1', 11).add(getBuyableAmount('1', 12)).add(getBuyableAmount('1', 13));
        if (player['1'].creations.gt(player['1'].creationsR)) player['1'].creationsR = player['1'].creations;
        if (player['1'].creations.gt(player['1'].creationsT)) player['1'].creationsT = player['1'].creations;
    },
    tabFormat: {
        "Creation Tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return 'Your faction coin find chance is ' + format(player.FCchance) + '%'},
                    {}],
                "blank",
                ["row", [
                    ["display-text",
                        function() { return '<font color = "#FF00FF">You have ' + formatWhole(player.fairyCoins) + ' fairy coins<br><font color = "#00FF00">You have ' + formatWhole(player.elfCoins) + ' elf coins<br><font color = "#00FFFF">You have ' + formatWhole(player.angelCoins) + ' angel coins'},
                        {}],
                    ["blank", ["17px"]],
                    "clickables",
                    ["blank", ["17px"]],
                    ["display-text",
                        function() { return '<font color = "#888800">You have ' + formatWhole(player.goblinCoins) + ' goblin coins<br><font color = "#8800FF">You have ' + formatWhole(player.undeadCoins) + ' undead coins<br><font color = "#880000">You have ' + formatWhole(player.demonCoins) + ' demon coins'},
                        {}]
                ]],
                "blank",
                ["display-text",
                    function() { return '<h2>Creations'},
                    {}],
                "blank",
                "buyables",
                "blank",
                ["display-text",
                    function() { if (getBuyableAmount('1', 11).gte(10) || getBuyableAmount('1', 12).gte(10) || getBuyableAmount('1', 13).gte(10)) return '<h2>Creation Tier Upgrades'},
                    {}],
                "blank",
                ["upgrades", [9, 10, 11, 12, 13, 14]],
                ["display-text",
                    function() { if (player['1'].points.gte(1)) return '<h2>Gem Power Upgrades'},
                    {}],
                "blank",
                ["upgrades", [201]],
            ],
        },
        "Faction Tab": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() { return 'Your faction coin find chance is ' + format(player.FCchance) + '%'},
                    {}],
                "blank",
                ["row", [
                    ["display-text",
                        function() { return '<font color = "#FF00FF">You have ' + formatWhole(player.fairyCoins) + ' fairy coins<br><font color = "#00FF00">You have ' + formatWhole(player.elfCoins) + ' elf coins<br><font color = "#00FFFF">You have ' + formatWhole(player.angelCoins) + ' angel coins'},
                        {}],
                    ["blank", ["17px"]],
                    "clickables",
                    ["blank", ["17px"]],
                    ["display-text",
                        function() { return '<font color = "#888800">You have ' + formatWhole(player.goblinCoins) + ' goblin coins<br><font color = "#8800FF">You have ' + formatWhole(player.undeadCoins) + ' undead coins<br><font color = "#880000">You have ' + formatWhole(player.demonCoins) + ' demon coins'},
                        {}]
                ]],
                "blank",
                ["row", [["upgrades", [1]], ["blank", ["17px"]], ["upgrades", [2]]]],
                ["row", [["upgrades", [3]], ["blank", ["17px"]], ["upgrades", [4]], ["blank", ["17px"]], ["upgrades", [5]]]],
                ["row", [["upgrades", [6]], ["blank", ["17px"]], ["upgrades", [7]], ["blank", ["17px"]], ["upgrades", [8]]]],
                ["upgrades", [103, 104, 105, 106, 107, 108, 113, 114, 115, 116, 117, 118]],
            ],
        },
    },
    clickables: {
        11: {
            title: "Click Button",
            display() {return "\nyour clicks are worth " + format(player['1'].clickValue) + " coins"},
            canClick() {return true},
            onClick() {
                // faction coin initialization
                let factionCoinGainType = randint(0, 6);
                let factionCoinsFound = new Decimal(0);
                let clickPower = player['1'].clickValue;
                // faction coins gained calculation
                if (player.FCchance.gte(new Decimal(100))) factionCoinsFound = player.FCchance.div(100).floor();
                else if (player.FCchance.div(100).gte(new Decimal(Math.random()))) factionCoinsFound = new Decimal(1);
                // earning the faction coins
                if (factionCoinGainType == 0) player.fairyCoins = player.fairyCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 1) player.elfCoins = player.elfCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 2) player.angelCoins = player.angelCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 3) player.goblinCoins = player.goblinCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 4) player.undeadCoins = player.undeadCoins.add(factionCoinsFound);
                else if (factionCoinGainType == 5) player.demonCoins = player.demonCoins.add(factionCoinsFound);
                player._FC = player._FC.add(factionCoinsFound);
                // faction coin totals
                player.FCtotal = player.FCtotal.add(factionCoinsFound);
                player.FCtotalR = player.FCtotalR.add(factionCoinsFound);
                player.FCtotalT = player.FCtotalT.add(factionCoinsFound);
                // times clicked
                player['1'].clickTimes = player['1'].clickTimes.add(1);
                // best times clicked
                if (player['1'].clickTimes.gt(player['1'].clickTimesBest)) player['1'].clickTimesBest = player['1'].clickTimes;
                if (player['1'].clickTimes.gt(player['1'].clickTimesBestT)) player['1'].clickTimesBestT = player['1'].clickTimes;
                // total times clicked
                player['1'].clickTimesTotal = player['1'].clickTimesTotal.add(1);
                player['1'].clickTimesTotalT = player['1'].clickTimesTotalT.add(1);
                // coins gained
                if (hasUpgrade('1', 11) && getClickableState('2', 13) == "ON") clickPower = clickPower.mul(clickableEffect('2', 13));
                player.points = player.points.add(clickPower);
                // total coins gained
                player['1'].clickTotalValue = player['1'].clickTotalValue.add(clickPower);
                player.total = player.total.add(clickPower);
	            player.totalR = player.totalR.add(clickPower);
	            player.totalT = player.totalT.add(clickPower);
                // best click value
                if (player['1'].clickValue.gt(player['1'].clickValueBest)) player['1'].clickValueBest = player['1'].clickValue;
                if (player['1'].clickValue.gt(player['1'].clickValueBestT)) player['1'].clickValueBestT = player['1'].clickValue;
                // best total click value
                if (player['1'].clickTotalValue.gt(player['1'].clickTotalValueBest)) player['1'].clickTotalValueBest = player['1'].clickTotalValue;
                if (player['1'].clickTotalValue.gt(player['1'].clickTotalValueBestT)) player['1'].clickTotalValueBestT = player['1'].clickTotalValue;
	            // total coins gained (this R and all time)
                player['1'].clickTotalValueTotal = player['1'].clickTotalValueTotal.add(clickPower);
                player['1'].clickTotalValueTotalT = player['1'].clickTotalValueTotalT.add(clickPower);
            },
        },
    },
    buyables: {
        11: {
            title() {
                let title = "Dirt";
                if (hasUpgrade('1', 91)) title = "Rich Dirt";
                if (hasUpgrade('1', 101)) title = "Richer Dirt";
                if (hasUpgrade('1', 111)) title = "Soil";
                if (hasUpgrade('1', 121)) title = "Fertile Soil";
                if (hasUpgrade('1', 131)) title = "Fertilized Soil";
                if (hasUpgrade('1', 141)) title = "Perfected Soil";
                return title;
            },
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5)) },
            effect() {
                let eff = new Decimal(0.1);
                if (hasUpgrade('1', 91)) eff = eff.add(0.05);
                if (hasUpgrade('1', 101)) eff = eff.add(0.1);
                if (hasUpgrade('1', 111)) eff = eff.add(0.2);
                if (hasUpgrade('1', 121)) eff = eff.add(0.4);
                if (hasUpgrade('1', 131)) eff = eff.add(0.65);
                if (hasUpgrade('1', 141)) eff = eff.add(1);
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1031));
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1032));
                return eff;
            },
            display() {
                if (this.cost() == new Decimal(1)) return "\nCost: 1 coin\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id));
                else return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id));
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost());
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1));
            },
            style: {'width':'180px', 'height':'180px'},
        },
        12: {
            title() {
                let title = "Pebbles";
                if (hasUpgrade('1', 92)) title = "Rocks";
                if (hasUpgrade('1', 102)) title = "Boulders";
                if (hasUpgrade('1', 112)) title = "Stone Hills";
                return title;
            },
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 100) },
            effect() {
                let eff = new Decimal(0.25);
                if (hasUpgrade('1', 92)) eff = eff.add(0.5);
                if (hasUpgrade('1', 102)) eff = eff.add(1.25);
                if (hasUpgrade('1', 112)) eff = eff.mul(2);
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1031));
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1032));
                return eff;
            },
            display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to passive production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id))},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost());
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1));
            },
            style: {'width':'180px', 'height':'180px'},
        },
        13: {
            title() {
                let title = "Weeds";
                if (hasUpgrade('1', 93)) title = "Grass";
                return title;
            },
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 10000) },
            effect() {
                let eff = new Decimal(2.5);
                if (hasUpgrade('1', 93)) eff = eff.add(0.5);
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1031));
                if (hasUpgrade('1', 1031)) eff = eff.mul(upgradeEffect('1', 1032));
                return eff;
            },
            display() { return "\nCost: " + format(this.cost()) + " coins\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +" + format(buyableEffect('1', this.id)) + " to passive production and\n+" + format(buyableEffect('1', this.id).div(10)) + "% to FC find chance\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * buyableEffect('1', this.id)) + "\nand +" + format((getBuyableAmount('1', this.id) * buyableEffect('1', this.id).div(10))) + "%"},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost());
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1));
            },
            style: {'width':'180px', 'height':'180px'},
        },
    },
    upgrades: {
        // side picking
        11: {
            fullDisplay() { return '<h3>Proof of Good Deed</h3><br>ally yourself with the side of good, which focuses on active production<br><br>Cost: 250 coins'},
            canAfford() {
                if (player.points.gte(250)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(250)
            },
            style: {'color':'#0000FF'},
            unlocked() { if (hasUpgrade('1', 11) == false && hasUpgrade('1', 21) == false) return true },
        },
        21: {
            fullDisplay() { return '<h3>Proof of Evil Deed</h3><br>ally yourself with the side of evil, which focuses on passive production<br><br>Cost: 250 coins'},
            canAfford() {
                if (player.points.gte(250)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(250)
            },
            style: {'color':'#FF0000'},
            unlocked() { if (hasUpgrade('1', 11) == false && hasUpgrade('1', 21) == false) return true },
        },
        // faction picking
        31: {
            fullDisplay() { return '<h3>Fairy Alliance</h3><br>ally yourself with the fairies, which focus on basic buildings<br><br>Cost: 5 fairy coins'},
            canAfford() {
                if (player.fairyCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.fairyCoins = player.fairyCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#FF00FF'},
            unlocked() { if (hasUpgrade('1', 11) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        41: {
            fullDisplay() { return '<h3>Elven Alliance</h3><br>ally yourself with the elves, which focus on click production<br><br>Cost: 5 elf coins'},
            canAfford() {
                if (player.elfCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.elfCoins = player.elfCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#00FF00'},
            unlocked() { if (hasUpgrade('1', 11) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        51: {
            fullDisplay() { return '<h3>Angel Alliance</h3><br>ally yourself with the angels, which focus on mana and spells<br><br>Cost: 5 angel coins'},
            canAfford() {
                if (player.angelCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.angelCoins = player.angelCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#00FFFF'},
            unlocked() { if (hasUpgrade('1', 11) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        61: {
            fullDisplay() { return '<h3>Goblin Alliance</h3><br>ally yourself with the goblins, which focus on faction coins<br><br>Cost: 5 goblin coins'},
            canAfford() {
                if (player.goblinCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.goblinCoins = player.goblinCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 21) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        71: {
            fullDisplay() { return '<h3>Undead Alliance</h3><br>ally yourself with the undead, which focus purely on passive production<br><br>Cost: 5 undead coins'},
            canAfford() {
                if (player.undeadCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.undeadCoins = player.undeadCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#8800FF'},
            unlocked() { if (hasUpgrade('1', 21) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        81: {
            fullDisplay() { return '<h3>Demon Alliance</h3><br>ally yourself with the demons, which focus on non-basic buildings<br><br>Cost: 5 demon coins'},
            canAfford() {
                if (player.demonCoins.gte(5)) return true;
                else return false;
            },
            pay() {
                player.demonCoins = player.demonCoins.sub(5);
                player._FC = player._FC.sub(5);
            },
            style: {'color':'#880000'},
            unlocked() { if (hasUpgrade('1', 21) && hasUpgrade('1', 31) == false && hasUpgrade('1', 41) == false && hasUpgrade('1', 51) == false && hasUpgrade('1', 61) == false && hasUpgrade('1', 71) == false && hasUpgrade('1', 81) == false) return true },
        },
        // creation tiers
        91: {
            fullDisplay() { return '<h3>Rich Dirt</h3><br>increases dirt\'s base effect by +0.05<br><br>Req: 10 dirt<br><br>Cost: 250 coins'},
            canAfford() {
                if (player.points.gte(250)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(250)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(10)) return true },
        },
        92: {
            fullDisplay() { return '<h3>Rocks</h3><br>increases pebble\'s base effect by +0.50<br><br>Req: 10 pebbles<br><br>Cost: 5,000 coins'},
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            unlocked() { if (getBuyableAmount('1', 12).gte(10)) return true },
        },
        93: {
            fullDisplay() { return '<h3>Grass</h3><br>increases weed\'s first base effect by +0.5, second base effect by +0.05%<br><br>Req: 10 weeds<br><br>Cost: 500,000 coins'},
            canAfford() {
                if (player.points.gte(500000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500000)
            },
            unlocked() { if (getBuyableAmount('1', 13).gte(10)) return true },
        },
        101: {
            fullDisplay() { return '<h3>Richer Dirt</h3><br>increases rich dirt\'s base effect by +0.10<br><br>Req: 25 rich dirt<br><br>Cost: 1,000 coins'},
            canAfford() {
                if (player.points.gte(1000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(1000)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(25) && hasUpgrade('1', 91)) return true },
        },
        102: {
            fullDisplay() { return '<h3>Boulders</h3><br>increases stone\'s base effect by +1.25<br><br>Req: 25 stones<br><br>Cost: 25,000 coins'},
            canAfford() {
                if (player.points.gte(25000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(25000)
            },
            unlocked() { if (getBuyableAmount('1', 12).gte(25) && hasUpgrade('1', 92)) return true },
        },
        111: {
            fullDisplay() { return '<h3>Soil</h3><br>increase richer dirt\'s base effect by +0.20<br><br>Req: 50 richer dirt<br><br>Cost: 5,000 coins'},
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(50) && hasUpgrade('1', 101)) return true },
        },
        112: {
            fullDisplay() { return '<h3>Stone Hills</h3><br>double boulder\'s base effect<br><br>Req: 50 boulders<br><br>Cost: 100,000 coins'},
            canAfford() {
                if (player.points.gte(100000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(100000)
            },
            unlocked() { if (getBuyableAmount('1', 12).gte(50) && hasUpgrade('1', 102)) return true },
        },
        121: {
            fullDisplay() { return '<h3>Fertile Soil</h3><br>increase soil\'s base effect by +0.40<br><br>Req: 100 soil<br><br>Cost: 25,000 coins'},
            canAfford() {
                if (player.points.gte(25000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(25000)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(100) && hasUpgrade('1', 111)) return true },
        },
        131: {
            fullDisplay() { return '<h3>Fertilized Soil</h3><br>increase fertile soil\'s base effect by +0.65<br><br>Req: 250 soil<br><br>Cost: 100,000 coins'},
            canAfford() {
                if (player.points.gte(100000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(100000)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(250) && hasUpgrade('1', 121)) return true },
        },
        141: {
            fullDisplay() { return '<h3>Perfected Soil</h3><br>increase fertilized soil\'s base effect by +1.00<br><br>Req: 500 soil<br><br>Cost: 500,000 coins'},
            canAfford() {
                if (player.points.gte(500000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500000)
            },
            unlocked() { if (getBuyableAmount('1', 11).gte(500) && hasUpgrade('1', 131)) return true },
        },
        // faction upgrades
        // fairy faction
        1031: {
            fullDisplay() { return '<h3>Fairy Dust</h3><br>multiply the effect of basic creations based on your mana regen<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 500 coins'},
            effect() { return player['2'].manaregen.add(1).mul(2).pow(0.5) },
            canAfford() {
                if (player.points.gte(500)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500)
            },
            style: {'color':'#FF00FF'},
            unlocked() { if (hasUpgrade('1', 31)) return true },
        },
        1032: {
            fullDisplay() { return '<h3>Fairy Workers</h3><br>multiply the effect of basic creations based on your basic creations<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 5,000 coins'},
            effect() { return player['1'].creations.add(1).pow(0.2) },
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            style: {'color':'#FF00FF'},
            unlocked() { if (hasUpgrade('1', 31)) return true },
        },
        1033: {
            fullDisplay() { return '<h3>Fairy Traders</h3><br>multiply click production and faction coin find chance based on your creations<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br>and +' + format(upgradeEffect('1', this.id).mul(3)) + '%<br><br>Cost: 50,000 coins'},
            effect() { return player['1'].creations.add(1).pow(0.1) },
            canAfford() {
                if (player.points.gte(50000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(50000)
            },
            style: {'color':'#FF00FF', 'height':'120px'},
            unlocked() { if (hasUpgrade('1', 31)) return true },
        },
        // angel faction
        1051: {
            fullDisplay() { return '<h3>Angelic Capacity</h3><br>multiply max mana based on your mana generated<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 500 coins'},
            effect() { return player['2'].manatotal.add(1).pow(0.075) },
            canAfford() {
                if (player.points.gte(500)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500)
            },
            style: {'color':'#00FFFF'},
            unlocked() { if (hasUpgrade('1', 51)) return true },
        },
        1052: {
            fullDisplay() { return '<h3>Angelic Capacity</h3><br>multiply mana regen based on your angel coins<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 5,000 coins'},
            effect() { return player.angelCoins.add(1).pow(0.5) },
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            style: {'color':'#00FFFF'},
            unlocked() { if (hasUpgrade('1', 51)) return true },
        },
        // goblin faction
        1061: {
            fullDisplay() { return '<h3>Jackpot</h3><br>increase faction coin find chance based on your coins<br><br>Effect: +' + format(upgradeEffect('1', this.id)) + '%<br><br>Cost: 500 coins'},
            effect() { return player.points.add(1).pow(0.2) },
            canAfford() {
                if (player.points.gte(500)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 61)) return true },
        },
        1062: {
            fullDisplay() { return '<h3>Greed</h3><br>multiply passive production based on your faction coins<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 5,000 coins'},
            effect() { return player._FC.add(1).pow(0.15) },
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 61)) return true },
        },
        1063: {
            fullDisplay() { return '<h3>Currency Revolution</h3><br>increase faction coin find chance based on your faction coins<br><br>Effect: +' + format(upgradeEffect('1', this.id)) + '%<br><br>Cost: 50,000 coins'},
            effect() { return player._FC.add(1).pow(0.5) },
            canAfford() {
                if (player.points.gte(50000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(50000)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 61)) return true },
        },
        1064: {
            fullDisplay() { return '<h3>Goblin Trade Route</h3><br>unlock 3 more goblin upgrades<br><br>Cost: 25 goblin coins'},
            canAfford() {
                if (player.goblinCoins.gte(25)) return true;
                else return false;
            },
            pay() {
                player.goblinCoins = player.goblinCoins.sub(25);
                player._FC = player._FC.sub(25);
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 61)) return true },
        },
        1161: {
            fullDisplay() { return '<h3>Moneyload</h3><br>multiply passive production based on your faction coin find chance<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 500,000 coins'},
            effect() { return player.FCchance.add(1).pow(0.4) },
            canAfford() {
                if (player.points.gte(500000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500000)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 1064)) return true },
        },
        1162: {
            fullDisplay() { return '<h3>Absurd Taxes</h3><br>increase the base effect of Tax Collection by +30 seconds<br><br>Cost: 5,000,000 coins'},
            canAfford() {
                if (player.points.gte(5000000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000000)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 1064)) return true },
        },
        1163: {
            fullDisplay() { return '<h3>Pride</h3><br>multiply passive production based on your goblin coins<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 50,000,000 coins'},
            effect() { return player.goblinCoins.add(1).pow(0.5) },
            canAfford() {
                if (player.points.gte(50000000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(50000000)
            },
            style: {'color':'#888800'},
            unlocked() { if (hasUpgrade('1', 1064)) return true },
        },
        // undead faction
        1071: {
            fullDisplay() { return '<h3>Undending Cycle</h3><br>multiply passive production based on your coins<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 500 coins'},
            effect() { return player.points.add(1).pow(0.15) },
            canAfford() {
                if (player.points.gte(500)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(500)
            },
            style: {'color':'#8800FF'},
            unlocked() { if (hasUpgrade('1', 71)) return true },
        },
        1072: {
            fullDisplay() { return '<h3>Corpse Piles</h3><br>multiply passive production based on your undead coins<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 5,000 coins'},
            effect() { return player.undeadCoins.add(1).pow(0.5) },
            canAfford() {
                if (player.points.gte(5000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            style: {'color':'#8800FF'},
            unlocked() { if (hasUpgrade('1', 71)) return true },
        },
        1073: {
            fullDisplay() { return '<h3>Stay no More</h3><br>multiply passive production based on your click production<br><br>Effect: x' + format(upgradeEffect('1', this.id)) + '<br><br>Cost: 50,000 coins'},
            effect() { return player['1'].clickValue.add(1).pow(0.2) },
            canAfford() {
                if (player.points.gte(50000)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(50000)
            },
            style: {'color':'#8800FF'},
            unlocked() { if (hasUpgrade('1', 71)) return true },
        },
        // other upgrades
        2011: {
            fullDisplay() { return '<h3>Gem Influence</h3><br>increase faction coin find chance based on your gems<br><br>Effect: +' + format(upgradeEffect('1', this.id)) + '%<br><br>Req: 20 1st creations'},
            effect() { return player['1'].points.add(1).pow(0.5) },
            canAfford() {
                if (getBuyableAmount('1', 11).gte(20)) return true;
                else return false;
            },
            unlocked() { if (player['1'].points.gte(1)) return true },
        },
    },
});

addLayer("2", {
    name: "Casting",
    symbol: "C",
    position: 1,
    startData() { return {
        unlocked: true,
        mana: new Decimal(0),
        manatotal: new Decimal(0),
        manatotalR: new Decimal(0),
        manatotalT: new Decimal(0),
        maxmana: new Decimal(100),
        maxmanabest: new Decimal(100),
        maxmanabestT: new Decimal(100),
        manaregen: new Decimal(0.1),
        manaregenbest: new Decimal(0.1),
        manaregenbestT: new Decimal(0.1),
        taxcasts: new Decimal(0),
        taxcastsR: new Decimal(0),
        taxcastsT: new Decimal(0),
        taxeff: new Decimal(30),
        callcasts: new Decimal(0),
        callcastsR: new Decimal(0),
        callcastsT: new Decimal(0),
        calleffboost: new Decimal(1),
        calltime: new Decimal(0),
        holycasts: new Decimal(0),
        holycastsR: new Decimal(0),
        holycastsT: new Decimal(0),
        frenzycasts: new Decimal(0),
        frenzycastsR: new Decimal(0),
        frenzycastsT: new Decimal(0),
        sidespellboost: new Decimal(1),
        sidespelltime: new Decimal(0),
    }},
    color: "#AA55AA",
    type: "none",
    row: 0,
    layerShown() {return true },
    tooltip() {return "Casting"},
    update(diff) {
        let manacapped = false;
        let prevmana = player['2'].mana;
        let manaregen = new Decimal(0.1);
        let maxmana = new Decimal(100);
        // spell boosts
        if (hasUpgrade('1', 1162)) taxeff = taxeff.add(30);
        // mana regen buffs
        if (hasUpgrade('2', 22) && upgradeEffect('2', 22).gt(0)) manaregen = manaregen.add(upgradeEffect('2', 22));
        if (hasUpgrade('1', 1052)) manaregen = manaregen.mul(upgradeEffect('1', 1052));
        player['2'].manaregen = manaregen;
        // max mana buffs
        if (hasUpgrade('1', 1051)) maxmana = maxmana.mul(upgradeEffect('1', 1051));
        if (hasUpgrade('2', 21)) maxmana = maxmana.mul(upgradeEffect('2', 21));
        player['2'].maxmana = maxmana;
        // increase mana
        if (player['2'].mana.add(player['2'].manaregen).gte(player['2'].maxmana))
            player['2'].mana = player['2'].maxmana,
            manacapped = true;
        else player['2'].mana = player['2'].mana.add(player['2'].manaregen);
        // total mana
        if (manacapped == false) player['2'].manatotal = player['2'].manatotal.add(player['2'].manaregen);
        else player['2'].manatotal = player['2'].manatotal.add(player['2'].maxmana.sub(prevmana));
        if (manacapped == false) player['2'].manatotalR = player['2'].manatotalR.add(player['2'].manaregen);
        else player['2'].manatotalR = player['2'].manatotalR.add(player['2'].maxmana.sub(prevmana));
        if (manacapped == false) player['2'].manatotalT = player['2'].manatotalT.add(player['2'].manaregen);
        else player['2'].manatotalT = player['2'].manatotalT.add(player['2'].maxmana.sub(prevmana));
        // best mana
        if (player['2'].maxmana.gt(player['2'].maxmanabest)) player['2'].maxmanabest = player['2'].maxmana;
        if (player['2'].maxmana.gt(player['2'].maxmanabestT)) player['2'].maxmanabestT = player['2'].maxmana;
        if (player['2'].manaregen.gt(player['2'].manaregenbest)) player['2'].manaregenbest = player['2'].manaregen;
        if (player['2'].manaregen.gt(player['2'].manaregenbestT)) player['2'].manaregenbestT = player['2'].manaregen;
        // spell time
        if (getClickableState('2', 12) == "ON") player['2'].calltime = player['2'].calltime.sub(diff);
        if (getClickableState('2', 13) == "ON") player['2'].sidespelltime = player['2'].sidespelltime.sub(diff);
        // spell done time
        if (player['2'].calltime.lte(0)) setClickableState('2', 12) == "OFF", player['2'].calltime = new Decimal(0);
        if (getClickableState('2', 102) == "colorless - ON" && player['2'].calltime.lte(0) && player['2'].mana.gte(160)) callcast();
        if (player['2'].sidespelltime.lte(0)) setClickableState('2', 13) == "OFF", player['2'].sidespelltime = new Decimal(0);
        if (getClickableState('2', 103) == "colorless - ON" && player['2'].sidespelltime.lte(0) && player['2'].mana.gte(120)) sidespellcast();
    },
    tabFormat: [
        ["display-text",
            function() { return '<h2>Casting'},
            {}],
        "blank",
        ["clickables", [1]],
        "blank",
        ["clickables", [10]],
        "blank",
        ["bar", "manabar"],
        "blank",
        ["display-text",
            function() { return '<h2>Mana Upgrades'},
            {}],
        ["display-text",
            function() { return 'you have ' + format(player['2'].manatotal) + ' mana generated'},
            {}],
        "blank",
        ["upgrades", [2]],
        ["display-text",
            function() { return '<h2>Autocasting Upgrades'},
            {}],
        ["display-text",
            function() { return 'you have ' + format(player['2'].manatotalR) + ' total mana generated'},
            {}],
        "blank",
        ["upgrades", [10]],
    ],
    clickables: {
        11: {
            title: '<font color = "#000000">Tax Collection',
            display() { return '<font color = "#000000">get coins equal to ' + formatWhole(player['2'].taxeff) + ' seconds of passive production<br><br>Effect: +' + format(getPointGen().mul(player['2'].taxeff)) + '<br><br>Cost: 80 mana' },
            canClick() { if (player['2'].mana.gte(80)) return true },
            onClick() {
                player['2'].mana = player['2'].mana.sub(80);
                player['2'].taxcasts = player['2'].taxcasts.add(1);
                player['2'].taxcastsR = player['2'].taxcastsR.add(1);
                player['2'].taxcastsT = player['2'].taxcastsT.add(1);
                player.points = player.points.add(getPointGen().mul(player['2'].taxeff));
            },
        },
        12: {
            title: '<font color = "#000000">Call to Arms',
            display() { return '<font color = "#000000">boost all production based on your creations created for 30 seconds<br>Time left: ' + format(player['2'].calltime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: 160 mana' },
            effect() { return player['1'].creations.add(1).pow(0.1).mul(player['2'].calleffboost)},
            canClick() {
                if (getClickableState('2', this.id) == "ON") return false;
                else if (player['2'].mana.gte(160)) return true;
                else return false;
            },
            onClick() {
                callcast()
            },
        },
        13: {
            title() {
                if (hasUpgrade('1', 11)) return '<font color = "#0000FF">Holy Light';
                else if (hasUpgrade('1', 21)) return '<font color = "#FF0000">Blood Frenzy';
                else return '<h1>LOCKED</h1><br><br>CHOOSE A SIDE TO UNLOCK';
            },
            display() {
                if (hasUpgrade('1', 11)) return '<font color = "#0000FF">boost click production based on your mana for 15 seconds<br>Time left: ' + format(player['2'].sidespelltime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: 120 mana';
                else if (hasUpgrade('1', 21)) return '<font color = "#FF0000">boost passive production based on your mana for 15 seconds<br>Time left: ' + format(player['2'].sidespelltime) + 's<br><br>Effect: x' + format(clickableEffect('2', this.id)) + '<br><br>Cost: 120 mana';
                else return "";
            },
            effect() { return player['2'].mana.add(1).pow(0.2).mul(player['2'].sidespellboost)},
            canClick() {
                if (getClickableState('2', this.id) == "ON") return false;
                else if (player['2'].mana.gte(120)) return true;
                else return false;
            },
            onClick() {
                sidespellcast()
            },
        },
        101: {
            title: '<font color = "#000000">Tax Collection Autocasting',
            display() { return 'LOCKED - need better autocasting' },
            canClick() { return false },
            unlocked() { if (hasUpgrade('2', 101)) return true },
        },
        102: {
            title: '<font color = "#000000">Call to Arms Autocasting',
            display() { return '<font color = "#000000">' + getClickableState('2', this.id) },
            canClick() { return true },
            onClick() {
                if (getClickableState('2', this.id) == "colorless - ON") setClickableState('2', this.id, "colorless - OFF");
                else setClickableState('2', this.id, "colorless - ON");
            },
            unlocked() { if (hasUpgrade('2', 101)) return true },
        },
        103: {
            title() {
                if (hasUpgrade('1', 11)) return '<font color = "#0000FF">Holy Light Autocasting';
                else if (hasUpgrade('1', 21)) return '<font color = "#FF0000">Blood Frenzy Autocasting';
                else return '<h1>LOCKED</h1><br><br>CHOOSE A SIDE TO UNLOCK';
            },
            display() {
                if (hasUpgrade('1', 11)) return '<font color = "#0000FF">' + getClickableState('2', this.id);
                else if (hasUpgrade('1', 21)) return '<font color = "#FF0000">' + getClickableState('2', this.id);
                else return "";
            },
            canClick() { return true },
            onClick() {
                if (getClickableState('2', this.id) == "colorless - ON") setClickableState('2', this.id, "colorless - OFF");
                else setClickableState('2', this.id, "colorless - ON");
            },
            unlocked() { if (hasUpgrade('2', 101)) return true },
        },
    },
    bars: {
        manabar: {
            direction: RIGHT,
            width: 500,
            height: 20,
            display() { return 'MANA REGEN: ' + format(player['2'].manaregen) + ' | MANA: ' + format(player['2'].mana) + ' | MAX MANA: ' + format(player['2'].maxmana)},
            fillStyle() { return {"background-color": "#AA55AA" } },
            borderStyle() { return {"border-color": "#AA55AA"} },
            progress() { return player['2'].mana.div(player['2'].maxmana)},
        },
    },
    upgrades: {
        11: {
            canAfford() {
                if (player['2'].mana.eq(player['2'].maxmana)) return true;
                else return false;
            },
        },
        21: {
            fullDisplay() { return '<h3>Mana Jar</h3><br>multiply max mana based on your mana<br><br>Effect: x' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 750 mana generated<br><br>Cost: 1,500 coins'},
            effect() { return player['2'].mana.add(1).pow(0.05) },
            canAfford() {
                if (player.points.gte(1000) && player['2'].manatotal.gte(750)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(1500)
            },
        },
        22: {
            fullDisplay() { return '<h3>Mana Aura</h3><br>increase mana regen based on your mana<br><br>Effect: +' + format(upgradeEffect('2', this.id)) + '<br><br>Req: 2,500 mana generated<br><br>Cost: 5,000 coins'},
            effect() { return player['2'].mana.add(1).pow(0.05).sub(1) },
            canAfford() {
                if (player.points.gte(5000) && player['2'].manatotal.gte(2500)) return true;
                else return false;
            },
            pay() {
                player.points = player.points.sub(5000)
            },
            unlocked() { if (player['2'].manatotal.gte(750)) return true },
        },
        101: {
            fullDisplay() { return '<h3>Colorless Autocasting</h3><br>unlock autocasting<br><br>Req: 20,000 total mana generated<br><br>Cost: 250 mana'},
            canAfford() {
                if (player['2'].mana.gte(250) && player['2'].manatotalR.gte(20000)) return true;
                else return false;
            },
            pay() {
                player['2'].mana = player['2'].mana.sub(250)
            },
        },
    },
});

addLayer("9", {
    name: "Stats",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: true,
    }},
    color: "#66DD66",
    type: "none",
    row: 1,
    layerShown(){return true},
    tooltip() {return "Stats"},
    tabFormat: [
        ["display-text",
            function() { return '<h1>STATS' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>THIS GAME' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.best) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.total) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].points) + '</b> gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your click production is <b>' + format(player['1'].clickValue)},
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValue) + '</b> coins from clicking' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimes) + '</b> times' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player._FC) + '</b> faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbest) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotal) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchance) + '%</b> faction coin chance' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CREATIONS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + getBuyableAmount('1', 11) + '</b> 1st creations'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + getBuyableAmount('1', 12) + '</b> 2nd creations'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + getBuyableAmount('1', 13) + '</b> 3rd creations'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].creations) + '</b> creations total'},
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>MANA' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].mana) + '</b> mana'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].maxmana) + '</b> max mana'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].manaregen) + '</b> mana regen'},
            {}],
        ["display-text",
            function() { return 'You have generated a total of <b>' + format(player['2'].manatotal) + '</b> mana' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CASTS' },
            {}],
        ["display-text",
            function() { return 'You have cast \'tax collection\' <b>' + formatWhole(player['2'].taxcasts) + '</b> times'},
            {}],
        ["display-text",
            function() { return 'You have cast \'call to arms\' <b>' + formatWhole(player['2'].callcasts) + '</b> times'},
            {}],
        ["display-text",
            function() { return 'You have cast \'holy light\' <b>' + formatWhole(player['2'].holycasts) + '</b> times'},
            {}],
        ["display-text",
            function() { return 'You have cast \'blood frenzy\' <b>' + formatWhole(player['2'].frenzycasts) + '</b> times'},
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>THIS REINCARNATION' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.bestR) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.totalR) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].best) + '</b> best gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your best click production is <b>' + format(player['1'].clickValue)},
            {}],
        ["display-text",
            function() { return 'Your best earnings from clicking is <b>' + format(player['1'].clickTotalValueBest) + '</b> coins' },
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValueTotal) + '</b> total coins from clicking' },
            {}],
        ["display-text",
            function() { return 'Your best times clicked is <b>' + formatWhole(player['1'].clickTimesBest) + '</b> times' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimesTotal) + '</b> times total' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbestR) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotalR) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchancebest) + '%</b> best faction coin chance' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CREATIONS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].creationsR) + '</b> best creations'},
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>MANA' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].maxmanabest) + '</b> best max mana'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].manaregenbest) + '</b> best mana regen'},
            {}],
        ["display-text",
            function() { return 'You have generated a total of <b>' + format(player['2'].manatotalR) + '</b> mana' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CASTS' },
            {}],
        ["display-text",
            function() { return 'You have cast \'tax collection\' <b>' + formatWhole(player['2'].taxcastsR) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'call to arms\' <b>' + formatWhole(player['2'].callcastsR) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'holy light\' <b>' + formatWhole(player['2'].holycastsR) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'blood frenzy\' <b>' + formatWhole(player['2'].frenzycastsR) + '</b> times total'},
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h2>ALL TIME' },
            {}],
        "blank",
        "h-line",
        "blank",
        ["display-text",
            function() { return '<h3>CURRENCY' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.bestT) + '</b> best coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.totalT) + '</b> total coins' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].best) + '</b> best gems' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CLICKS' },
            {}],
        ["display-text",
            function() { return 'Your best click production is <b>' + format(player['1'].clickValueBestT)},
            {}],
        ["display-text",
            function() { return 'Your best earnings from clicking is <b>' + format(player['1'].clickTotalValueBestT) + '</b> coins' },
            {}],
        ["display-text",
            function() { return 'You have earned <b>' + format(player['1'].clickTotalValueTotalT) + '</b> total coins from clicking' },
            {}],
        ["display-text",
            function() { return 'Your best times clicked is <b>' + formatWhole(player['1'].clickTimesBestT) + '</b> times' },
            {}],
        ["display-text",
            function() { return 'You have clicked <b>' + formatWhole(player['1'].clickTimesTotalT) + '</b> times total' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>FACTION COINS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCbestT) + '</b> best faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player.FCtotalT) + '</b> total faction coins'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player.FCchancebestT) + '%</b> best faction coin chance' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CREATIONS' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + formatWhole(player['1'].creationsT) + '</b> best creations'},
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>MANA' },
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].maxmanabestT) + '</b> best max mana'},
            {}],
        ["display-text",
            function() { return 'You have <b>' + format(player['2'].manaregenbestT) + '</b> best mana regen'},
            {}],
        ["display-text",
            function() { return 'You have generated a total of <b>' + format(player['2'].manatotalT) + '</b> mana' },
            {}],
        "blank",
        ["display-text",
            function() { return '<h3>CASTS' },
            {}],
        ["display-text",
            function() { return 'You have cast \'tax collection\' <b>' + formatWhole(player['2'].taxcastsT) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'call to arms\' <b>' + formatWhole(player['2'].callcastsT) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'holy light\' <b>' + formatWhole(player['2'].holycastsT) + '</b> times total'},
            {}],
        ["display-text",
            function() { return 'You have cast \'blood frenzy\' <b>' + formatWhole(player['2'].frenzycastsT) + '</b> times total'},
            {}],
        "blank",
    ],
});
