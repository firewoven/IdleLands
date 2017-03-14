"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var RestrictedNumber = require("restricted-number");
var game_state_1 = require("../game-state");
var settings_1 = require("../../static/settings");
var logger_1 = require("../../shared/logger");
var equipment_1 = require("../base/equipment");
var spellmanager_1 = require("../../plugins/combat/spellmanager");
var effectmanager_1 = require("../../plugins/combat/effectmanager");
var stat_calculator_1 = require("../../shared/stat-calculator");
var generator_js_1 = require("./generator.js");
var Character = (function () {
    function Character() {
    }
    Character.prototype.init = function (opts) {
        var _this = this;
        _.extend(this, opts);
        if (!this.name)
            logger_1.Logger.error('Player', new Error('No name specified.'), opts);
        if (!this._hp)
            this._hp = { minimum: 0, maximum: 20, __current: 20 };
        if (!this._mp)
            this._mp = { minimum: 0, maximum: 0, __current: 0 };
        if (!this._xp)
            this._xp = { minimum: 0, maximum: this.levelUpXpCalc(1), __current: 0 };
        if (!this._level)
            this._level = { minimum: 0, maximum: settings_1.SETTINGS.maxLevel, __current: this.levelSet || 1 };
        if (!this._special)
            this._special = { minimum: 0, maximum: 0, __current: 0 };
        if (this._level.maximum < settings_1.SETTINGS.maxLevel) {
            this._level.maximum = settings_1.SETTINGS.maxLevel;
        }
        if (this._xp.__current > this._xp.maximum) {
            this._xp.__current = this._xp.maximum;
        }
        _.each(['_hp', '_mp', '_xp', '_level', '_special'], function (stat) {
            if (_.isNaN(_this[stat].__current))
                _this[stat].__current = 0;
            _this[stat].__proto__ = RestrictedNumber.prototype;
        });
        _.each(_.compact(_.flatten(_.values(this.equipment))), function (item) {
            delete item.isUnderNormalPercent;
            delete item.isNormallyEnchantable;
            delete item.isNothing;
            delete item.score;
            delete item.fullname;
            item.__proto__ = equipment_1.Equipment.prototype;
        });
        if (!this.gender)
            this.gender = _.sample(['male', 'female']);
        if (!this.professionName)
            this.professionName = 'Generalist';
        if (!this.equipment)
            this.equipment = {};
        if (!this.statCache)
            this.statCache = {};
        this.$effects = new effectmanager_1.EffectManager();
        this.$stats = new Proxy({}, {
            get: function (target, name) {
                if (_.includes(generator_js_1.Generator.stats, name) && !_.includes(['gold', 'xp'], name)) {
                    return stat_calculator_1.StatCalculator.stat(_this, name);
                }
                if (!stat_calculator_1.StatCalculator[name])
                    return null;
                try {
                    return stat_calculator_1.StatCalculator[name](_this);
                }
                catch (e) {
                    logger_1.Logger.error('Character: $stats', e, { name: name });
                }
            }
        });
        this.changeProfession(this.professionName);
    };
    Object.defineProperty(Character.prototype, "hp", {
        get: function () { return this._hp.__current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "mp", {
        get: function () { return this._mp.__current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "xp", {
        get: function () { return this._xp.__current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "level", {
        get: function () { return this._level.__current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "special", {
        get: function () { return this._special.__current; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "profession", {
        get: function () { return this.$profession; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "liveStats", {
        get: function () { return this.$stats; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "stats", {
        get: function () { return this.statCache; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "fullname", {
        get: function () { return this.name; },
        enumerable: true,
        configurable: true
    });
    Character.prototype.randomDeathMessage = function () {
        return _.sample([
            '%player watched %hisher innards become outards.',
            '%player vanished into thin air.',
            '%player has died.',
            '%player isn\'t pining for the fjords!',
            '%player has passed on.',
            '%player has gone to meet their maker.',
            '%player\'s a stiff!',
            'Bereft of life, %player can finally rest in pieces.',
            '%player\'s metabolic processes are now history!',
            '%player kicked the bucket, and the bucket kicked back!'
        ]);
    };
    Object.defineProperty(Character.prototype, "deathMessage", {
        get: function () {
            return this._deathMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "party", {
        get: function () {
            if (!this.$partyName)
                return null;
            return game_state_1.GameState.getInstance().getParty(this.$partyName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "itemScore", {
        get: function () {
            return _.reduce(_.flatten(_.values(this.equipment)), function (prev, cur) {
                return prev + cur.score;
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "score", {
        get: function () {
            return this.itemScore;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "spells", {
        get: function () {
            return spellmanager_1.SpellManager.validSpells(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "isPlayer", {
        get: function () { return this.joinDate; },
        enumerable: true,
        configurable: true
    });
    Character.prototype.recalculateStats = function (otherStats) {
        var _this = this;
        if (otherStats === void 0) { otherStats = stat_calculator_1.ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier']); }
        _.each(otherStats, function (stat) {
            var val = _this.liveStats[stat];
            if (_.includes(['xp', 'gold'], stat))
                return;
            _this.statCache[stat] = val;
        });
        var hpVal = stat_calculator_1.StatCalculator.hp(this);
        this._hp.maximum = this._hp.__current = hpVal + (this.hpBoost || 0);
        var mpVal = stat_calculator_1.StatCalculator.mp(this);
        this._mp.maximum = this._mp.__current = mpVal + (this.mpBoost || 0);
    };
    Character.prototype.changeProfession = function (professionName) {
        if (this.$profession)
            this.$profession.unload(this);
        this.professionName = professionName;
        this.$profession = require("../professions/" + professionName)[professionName];
        this.$profession.load(this);
        this.recalculateStats();
    };
    Character.prototype.calcLuckBonusFromValue = function (value) {
        if (value === void 0) { value = this.liveStats.luk; }
        var tiers = [1, 2, 4, 6, 10, 20, 35, 65, 125, 175, 200, 250, 400, 450, 500];
        var postMaxTierDifference = 150;
        var bonus = 0;
        for (var i = 0; i < tiers.length; i++) {
            if (value >= tiers[i]) {
                bonus++;
            }
        }
        var postmax = tiers[tiers.length - 1] + postMaxTierDifference;
        if (value >= tiers[tiers.length - 1]) {
            while (value > postmax) {
                bonus++;
                postmax += postMaxTierDifference;
            }
        }
        return bonus;
    };
    Character.prototype.canEquip = function (item, rangeBoostMultiplier, useCheckRangeMultiplier) {
        if (rangeBoostMultiplier === void 0) { rangeBoostMultiplier = 1; }
        if (useCheckRangeMultiplier === void 0) { useCheckRangeMultiplier = true; }
        var myItem = this.equipment[item.type];
        var checkScore = item.score;
        var myScore = myItem ? myItem.score : -1000;
        var itemFindRange = rangeBoostMultiplier * this.liveStats.itemFindRange;
        var checkRangeMultiplier = this.$personalities && this.$personalities.isActive('SharpEye') ? 0.65 : 0.05;
        if (!useCheckRangeMultiplier) {
            checkRangeMultiplier = 0;
        }
        return checkScore > (myScore * checkRangeMultiplier) && checkScore <= itemFindRange;
    };
    Character.prototype.equip = function (item) {
        item._wasEquipped = true;
        this.equipment[item.type] = item;
        this.recalculateStats();
        if (this.$statistics) {
            this.$statistics.incrementStat('Character.Item.Equip');
        }
    };
    Character.prototype.levelUp = function () {
        this._level.add(1);
        this.resetMaxXp();
        this._xp.toMinimum();
        this.recalculateStats();
    };
    Character.prototype.resetMaxXp = function () {
        this._xp.maximum = this.levelUpXpCalc(this.level);
    };
    Character.prototype.levelUpXpCalc = function (level) {
        var xp = Math.floor(100 + (400 * Math.pow(level, 1.71)));
        if (level > 200) {
            var modifier = level - 200;
            xp += (xp * (modifier / 100));
            if (level >= this._level.maximum - settings_1.SETTINGS.ascensionLevelBoost) {
                var levelsTilMax = this._level.maximum - level;
                var multiplier = settings_1.SETTINGS.ascensionXpCurve * (settings_1.SETTINGS.ascensionLevelBoost - levelsTilMax);
                xp += (xp * (multiplier / 100));
            }
        }
        return Math.floor(xp);
    };
    Character.prototype.gainGold = function (gold) {
        if (gold === void 0) { gold = 1; }
        this.gold += gold;
        if (this.gold < 0 || _.isNaN(this.gold)) {
            this.gold = 0;
        }
        return gold;
    };
    Character.prototype.gainXp = function (xp) {
        if (xp === void 0) { xp = 1; }
        this._xp.add(xp);
        return xp;
    };
    Character.prototype.sellItem = function (item) {
        var value = Math.max(1, Math.floor(item.score * this.liveStats.itemValueMultiplier));
        var maxValue = this.liveStats.itemFindRange * 10;
        if (this.$statistics) {
            this.$statistics.incrementStat('Character.Item.Sell');
        }
        var gold = this.gainGold(value);
        return Math.min(maxValue, gold);
    };
    return Character;
}());
exports.Character = Character;
