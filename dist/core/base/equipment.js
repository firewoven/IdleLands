"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();
var Equipment = (function () {
    function Equipment(opts) {
        _.extend(this, Equipment.defaults, opts);
        this.id = chance.guid();
        this.foundAt = Date.now();
        this._baseScore = this.score;
    }
    Equipment.prototype.isUnderNormalPercent = function (player) {
        var boost = player._$maxItemBoost();
        return (this._calcScore / this._baseScore) < (3 + boost);
    };
    Object.defineProperty(Equipment.prototype, "isNormallyEnchantable", {
        get: function () {
            return this.enchantLevel < 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Equipment.prototype, "isNothing", {
        get: function () {
            return this.name === 'nothing';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Equipment.prototype, "score", {
        get: function () {
            var _this = this;
            var ret = 0;
            _.each(Equipment.multipliers, function (mult, attr) {
                if (!_this[attr])
                    return;
                ret += _this[attr] * mult;
            });
            ret = ~~ret;
            this._calcScore = ret;
            return ret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Equipment.prototype, "fullname", {
        get: function () {
            if (this.enchantLevel > 0)
                return "+" + this.enchantLevel + " " + this.name;
            return "" + this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Equipment;
}());
Equipment.defaults = {
    itemClass: 'basic',
    str: 0,
    dex: 0,
    con: 0,
    agi: 0,
    int: 0,
    luk: 0,
    enchantLevel: 0
};
Equipment.multipliers = {
    str: 1.5,
    dex: 1,
    agi: 1,
    con: 2.5,
    int: 2,
    luk: 5,
    enchantLevel: -125,
    xp: 50,
    hp: 0.5,
    mp: 0.2,
    hpregen: 4,
    mpregen: 2,
    crit: 100,
    prone: 400,
    venom: 500,
    poison: 350,
    shatter: 300,
    vampire: 700,
    damageReduction: 2,
    gold: 0.5,
    sentimentality: 1,
    dance: 100,
    defense: 100,
    offense: 100,
    deadeye: 100,
    lethal: 200,
    silver: 100,
    power: 100,
    vorpal: 500,
    aegis: 100,
    glowing: 300
};
exports.Equipment = Equipment;
