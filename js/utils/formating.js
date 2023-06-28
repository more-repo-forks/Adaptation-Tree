function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor();
    let m = num.div(Decimal.pow(10, e));
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne;
        e = e.add(1);
    };
    e = e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0));
    if (mantissa) return m.toStringWithDecimalPlaces(precision) + "e" + e;
    return "e" + e;
};

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN";
    if (num.mag < 0.001) return (0).toFixed(precision);
    let init = num.toStringWithDecimalPlaces(precision);
    let portions = init.split(".");
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    if (portions.length == 1) return portions[0];
    return portions[0] + "." + portions[1];
};

function regularFormat(num, precision, small) {
    if (num === null || num === undefined) return "NaN";
    if (num.mag < 0.0001) return (0).toFixed(precision);
    if (num.mag < 0.1 && precision !== 0 && small) precision = Math.max(precision, 4);
    return num.toStringWithDecimalPlaces(precision);
};

function fixValue(x, y = 0) {
    return x || new Decimal(y);
};

function sumValues(x) {
    x = Object.values(x);
    if (!x[0]) return decimalZero;
    return x.reduce((a, b) => Decimal.add(a, b));
};

function format(decimal, precision = 2, small = true) {
    if (options.extendplaces && precision == 2) precision = 3;
    decimal = new Decimal(decimal);
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN";
    };
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small);
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity";
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog();
        if (slog.gte(1e6)) return "F" + format(slog.floor());
        return decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0);
    };
    if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false);
    if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0);
    if (decimal.gte(1e9)) return exponentialFormat(decimal, precision);
    if (decimal.gte(1e3)) return commaFormat(decimal, 0);
    if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision, small);
    if (decimal.eq(0)) return (0).toFixed(precision);
    decimal = invertOOM(decimal);
    let val = "";
    if (decimal.lt("1e1000")) {
        val = exponentialFormat(decimal, precision);
        return val.replace(/([^(?:e|F)]*)$/, '-$1');
    };
    return format(decimal, precision) + "⁻¹";
};

function formatWhole(decimal) {
    decimal = new Decimal(decimal);
    if (decimal.gte(1e9)) return format(decimal, 2);
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2);
    return format(decimal, 0);
};

function formatTime(s) {
    if (s < 60) return format(s) + "s";
    if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s";
    if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s";
    if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s";
    return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s";
};

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x);
    let result = x.toStringWithDecimalPlaces(precision);
    if (new Decimal(result).gte(maxAccepted)) result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision);
    return result;
};

// Will also display very small numbers
function formatSmall(x, precision = 2) {
    return format(x, precision, true);
};

function invertOOM(x) {
    let e = x.log10().ceil();
    let m = x.div(Decimal.pow(10, e));
    return new Decimal(10).pow(e.neg()).mul(m);
};