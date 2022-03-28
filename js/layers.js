addLayer("1", {
    name: "Main Tab",
    symbol: "M",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
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
    requires: new Decimal(250),
    resource: "gems",
    baseResource: "coins",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 0,
    effectDescription() {return "which effect is increasing all production by " + player['1'].gemMult + "% each, for a total of " + (format(1 + (player['1'].points) * player['1'].gemMult * 0.01)) + 'x'},
    hotkeys: [
        {key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tooltip() {return "Main Tab"},
    doReset(resettingLayer) {
        let keep = [];
        if (resettingLayer = '1') keep.push("points", "best", "clickTotalValue", "clickTimes");
        layerDataReset('1', keep);
    },
    update() {
        player['1'].clickValue = new Decimal(1 + getBuyableAmount('1', 11) * 0.1);
        if (player.points > player.best) player.best = new Decimal(player.points);
	    if (player.points > player.bestR) player.bestR = new Decimal(player.points);
	    if (player.points > player.bestT) player.bestT = new Decimal(player.points);
	    player.total = new Decimal(player.total.add(getPointGen()));
	    player.totalR = new Decimal(player.totalR.add(getPointGen()));
	    player.totalT = new Decimal(player.totalT.add(getPointGen()));
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text",
            function() { return 'You have ' + format(player.points) + ' coins' },
            {}],
        "blank",
        "clickables",
        "blank",
        "buyables",
    ],
    clickables: {
        11: {
            title: "Click Button",
            display() {return "\nyour clicks are worth " + format(player['1'].clickValue) + " coins"},
            canClick() {return true},
            onClick() {
                player['1'].clickTimes = new Decimal(player['1'].clickTimes.add(1));
                if (player['1'].clickTimes > player['1'].clickTimesBest) player['1'].clickTimesBest = new Decimal(player['1'].clickTimes);
                if (player['1'].clickTimes > player['1'].clickTimesBestT) player['1'].clickTimesBestT = new Decimal(player['1'].clickTimes);
                player['1'].clickTimesTotal = new Decimal(player['1'].clickTimesTotal.add(1));
                player['1'].clickTimesTotalT = new Decimal(player['1'].clickTimesTotalT.add(1));
                player.points = new Decimal(player.points.add(player['1'].clickValue));
                player['1'].clickTotalValue = new Decimal(player['1'].clickTotalValue.add(player['1'].clickValue));
                if (player.points > player.best) player.best = player.points;
	            if (player.points > player.bestR) player.bestR = new Decimal(player.points);
	            if (player.points > player.bestT) player.bestT = new Decimal(player.points);
	            player.total = new Decimal(player.total.add(player['1'].clickValue));
	            player.totalR = new Decimal(player.totalR.add(player['1'].clickValue));
	            player.totalT = new Decimal(player.totalT.add(player['1'].clickValue));
                if (player['1'].clickValue > player['1'].clickValueBest) player['1'].clickValueBest = new Decimal(player['1'].clickValue);
                if (player['1'].clickValue > player['1'].clickValueBestT) player['1'].clickValueBestT = new Decimal(player['1'].clickValue);
                if (player['1'].clickTotalValue > player['1'].clickTotalValueBest) player['1'].clickTotalValueBest = new Decimal(player['1'].clickTotalValue);
                if (player['1'].clickTotalValue > player['1'].clickTotalValueBestT) player['1'].clickTotalValueBestT = new Decimal(player['1'].clickTotalValue);
	            player['1'].clickTotalValueTotal = new Decimal(player.total.add(player['1'].clickValue).add(-1));
                player['1'].clickTotalValueTotalT = new Decimal(player.total.add(player['1'].clickValue).add(-1));
            },
        },
    },
    buyables: {
        11: {
            title: "Dirt",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5)) },
            display() { return "\nCost: " + format(this.cost()) + "\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +0.1 to click production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * 0.1)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
        },
        12: {
            title: "Rocks",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 100) },
            display() { return "\nCost: " + format(this.cost()) + "\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +0.2 to passive production\n\nTotal Effect: +" + format(getBuyableAmount('1', this.id) * 0.2)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
        },
        13: {
            title: "Grass",
            cost() { return new Decimal(Math.pow(getBuyableAmount('1', this.id).add(1), 1.5) * 10000) },
            display() { return "\nCost: " + format(this.cost()) + "\n\nAmount: " + getBuyableAmount('1', this.id) + "\n\nEffect: +1 to click production and passive production\n\nTotal Effect: +" + getBuyableAmount('1', this.id)},
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount('1', this.id, getBuyableAmount('1', this.id).add(1))
            },
            style: {'width':'180px', 'height':'180px'},
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
    color: "#00FF00",
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
            function() { return 'You have <b>' + format(player.points) + '</b> coins' },
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
    ],
});
