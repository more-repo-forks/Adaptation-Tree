addLayer("a", {
    name: "Abdication",
    symbol: "A",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        clickValue: new Decimal(1),
        clickTimes: 0,
    }},
    color: "#FFFFFF",
    requires: new Decimal(1000000),
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
    hotkeys: [
        {key: "a", description: "A: Abdicate for gems", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    clickables: {
        11: {
            title: "Click Button",
            display() {return "your clicks are worth " + player['1'].clickValue + " coins"},
            onClick() {
                player['1'].clickTimes = player['1'].clickTimes + 1
                player.points = new Decimal(player.points + player['1'].clickValue)
            },
        }
    },
});
