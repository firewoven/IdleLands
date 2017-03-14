"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var settings_1 = require("../static/settings");
var game_state_1 = require("../core/game-state");
exports.SPECIAL_STATS_BASE = [
    { name: 'hpregen', desc: 'Regenerate HP every combat round.', enchantMax: 100 },
    { name: 'mpregen', desc: 'Regenerate MP every combat round.', enchantMax: 100 },
    { name: 'damageReduction', desc: 'Take 1 fewer damage per point from some sources. Stacks intensity.', enchantMax: 100 },
    { name: 'crit', desc: '+1% crit chance. Stacks intensity.', enchantMax: 1 },
    { name: 'dance', desc: '+50% dodge chance.', enchantMax: 1 },
    { name: 'deadeye', desc: '+50% chance to beat opponent dodge.', enchantMax: 1 },
    { name: 'offense', desc: '+10% offensive combat rolls. Stacks intensity.', enchantMax: 1 },
    { name: 'defense', desc: '+10% defensive combat rolls. Stacks intensity.', enchantMax: 1 },
    { name: 'lethal', desc: '+50% critical damage.', enchantMax: 1 },
    { name: 'aegis', desc: 'Negates critical hits.', enchantMax: 1 },
    { name: 'silver', desc: '+10% minimum attack damage.', enchantMax: 1 },
    { name: 'power', desc: '+10% maximum attack damage.', enchantMax: 1 },
    { name: 'vorpal', desc: '+10% critical chance.', enchantMax: 1 },
    { name: 'glowing', desc: '+5% to all physical combat rolls. Stacks intensity.', enchantMax: 1 },
    { name: 'sentimentality', desc: '+1 score. Stacks intensity.', enchantMax: 500 },
    { name: 'hp', desc: '+1 hp. Stacks intensity.', enchantMax: 2000 },
    { name: 'mp', desc: '+1 mp. Stacks intensity.', enchantMax: 2000 },
    { name: 'xp', desc: 'Gain +1 xp every time xp is gained.', enchantMax: 1 },
    { name: 'gold', desc: 'Gain +1 gold every time gold is gained.', enchantMax: 500 }
];
exports.ATTACK_STATS_BASE = [
    { name: 'prone', desc: '+5% chance of stunning an opponent for 1 round.', enchantMax: 1 },
    { name: 'venom', desc: '+5% chance of inflicting venom (DoT, % of target HP) on an enemy. Stacks intensity.', enchantMax: 1 },
    { name: 'poison', desc: '+5% chance of inflicting poison (DoT, based on caster INT) on an enemy. Stacks intensity.', enchantMax: 1 },
    { name: 'shatter', desc: '+5% chance of inflicting shatter (-10% CON/DEX/AGI) on an enemy. Stacks intensity.', enchantMax: 1 },
    { name: 'vampire', desc: '+5% chance of inflicting vampire (health drain) on an enemy. Stacks intensity.', enchantMax: 1 }
];
exports.BASE_STATS = ['str', 'con', 'dex', 'int', 'agi', 'luk'];
exports.SPECIAL_STATS = _.map(exports.SPECIAL_STATS_BASE, 'name');
exports.ATTACK_STATS = _.map(exports.ATTACK_STATS_BASE, 'name');
exports.ALL_STATS = exports.BASE_STATS.concat(exports.SPECIAL_STATS).concat(exports.ATTACK_STATS);
var StatCalculator = (function () {
    function StatCalculator() {
    }
    StatCalculator._reduction = function (stat, args, baseValue) {
        if (args === void 0) { args = []; }
        if (baseValue === void 0) { baseValue = 0; }
        return baseValue + this._baseStat(args[0], stat);
    };
    StatCalculator._secondPassFunctions = function (player, stat) {
        var possibleFunctions = [player.$profession.classStats]
            .concat(this._achievementFunctions(player, stat))
            .concat(this._personalityFunctions(player, stat));
        return _(possibleFunctions)
            .map(stat)
            .filter(_.isFunction)
            .compact()
            .value();
    };
    StatCalculator._baseStat = function (player, stat) {
        return this.classStat(player, stat)
            + this.effectStat(player, stat)
            + this.equipmentStat(player, stat)
            + this.professionStat(player, stat)
            + this.achievementStat(player, stat)
            + this.personalityStat(player, stat);
    };
    StatCalculator.equipmentStat = function (player, stat) {
        return _(player.equipment)
            .values()
            .flatten()
            .compact()
            .map(function (item) { return _.isNumber(item[stat]) ? item[stat] : 0; })
            .sum();
    };
    StatCalculator.professionStat = function (player, stat) {
        var base = player.$profession.classStats[stat];
        if (!base || _.isFunction(base))
            return 0;
        return base;
    };
    StatCalculator.effectStat = function (player, stat) {
        return _(player.$effects.effects)
            .map(function (effect) { return effect[stat] || 0; })
            .sum();
    };
    StatCalculator.classStat = function (player, stat) {
        return player.level * (player.$profession["base" + _.capitalize(stat) + "PerLevel"] || 0);
    };
    StatCalculator._achievementFunctions = function (player, stat) {
        if (!player.$achievements)
            return [];
        return _(player.$achievements.achievements)
            .values()
            .map('rewards')
            .flattenDeep()
            .compact()
            .reject(function (bonus) { return bonus.type !== 'stats'; })
            .reject(function (bonus) { return !bonus[stat]; })
            .value();
    };
    StatCalculator.achievementStat = function (player, stat) {
        if (!player.$achievements)
            return 0;
        return _(player.$achievements.achievements)
            .values()
            .map('rewards')
            .flattenDeep()
            .compact()
            .reject(function (bonus) { return bonus.type !== 'stats'; })
            .reject(function (bonus) { return !bonus[stat] || _.isFunction(bonus[stat]); })
            .reduce(function (prev, cur) { return prev + (+cur[stat]); }, 0);
    };
    StatCalculator._personalityFunctions = function (player) {
        if (!player.$achievements)
            return [];
        return _(player.$personalities._activePersonalityData())
            .map('stats')
            .value();
    };
    StatCalculator.personalityStat = function (player, stat) {
        if (!player.$personalities)
            return 0;
        return _(player.$personalities._activePersonalityData())
            .reject(function (pers) { return !pers.stats[stat] || _.isFunction(pers.stats[stat]); })
            .map(function (pers) { return pers.stats[stat] || 0; })
            .sum();
    };
    StatCalculator.stat = function (player, stat, baseValueMod, doRound) {
        if (baseValueMod === void 0) { baseValueMod = 0; }
        if (doRound === void 0) { doRound = true; }
        if (player.$dirty && !player.$dirty.flags[stat] && player.stats[stat]) {
            return player.stats[stat];
        }
        if (player.$dirty) {
            player.$dirty.flags[stat] = false;
        }
        var mods = 0;
        var baseValue = baseValueMod + this._baseStat(player, stat);
        var functions = this._secondPassFunctions(player, stat);
        _.each(functions, function (func) {
            mods += func(player, baseValue);
        });
        var festivals = game_state_1.GameState.getInstance().festivals;
        _.each(festivals, function (festival) {
            if (!festival.bonuses[stat])
                return;
            mods += festival.bonuses[stat] * baseValue;
        });
        return doRound ? Math.floor(baseValue + mods) : baseValue + mods;
    };
    StatCalculator.gold = function (player) {
        var _this = this;
        return function (baseVal) {
            return _this.stat(player, 'gold', baseVal, true);
        };
    };
    StatCalculator.xp = function (player) {
        var _this = this;
        return function (baseVal) {
            return _this.stat(player, 'xp', baseVal, true);
        };
    };
    StatCalculator.hp = function (player) {
        var level = player.level;
        var prof = player.$profession;
        return Math.max(1, prof.baseHpPerLevel * level
            + prof.baseHpPerStr * this.stat(player, 'str')
            + prof.baseHpPerCon * this.stat(player, 'con')
            + prof.baseHpPerDex * this.stat(player, 'dex')
            + prof.baseHpPerAgi * this.stat(player, 'agi')
            + prof.baseHpPerInt * this.stat(player, 'int')
            + prof.baseHpPerLuk * this.stat(player, 'luk')
            + this.stat(player, 'hp'));
    };
    StatCalculator.mp = function (player) {
        var level = player.level;
        var prof = player.$profession;
        return Math.max(0, prof.baseMpPerLevel * level
            + prof.baseMpPerStr * this.stat(player, 'str')
            + prof.baseMpPerCon * this.stat(player, 'con')
            + prof.baseMpPerDex * this.stat(player, 'dex')
            + prof.baseMpPerAgi * this.stat(player, 'agi')
            + prof.baseMpPerInt * this.stat(player, 'int')
            + prof.baseMpPerLuk * this.stat(player, 'luk')
            + this.stat(player, 'mp'));
    };
    StatCalculator.overcomeDodge = function (player) {
        return (1 + (this.stat(player, 'deadeye') > 0 ? 1.5 : 1) +
            (this.stat(player, 'glowing') * 0.05) +
            (this.stat(player, 'offense') * 0.1)) *
            Math.max(10, (this.stat(player, 'str')
                + this.stat(player, 'dex')
                + this.stat(player, 'con')
                + this.stat(player, 'int')
                + this.stat(player, 'agi')
                + this.stat(player, 'luk')));
    };
    StatCalculator.dodge = function (player) {
        return (1 + (this.stat(player, 'dance') > 0 ? 1.5 : 1) +
            (this.stat(player, 'glowing') * 0.05) +
            (this.stat(player, 'defense') * 0.1)) *
            (this.stat(player, 'agi')
                + this.stat(player, 'luk')) / 8;
    };
    StatCalculator.hit = function (player) {
        return (1 + (this.stat(player, 'offense') * 0.1) +
            (this.stat(player, 'glowing') * 0.05)) *
            Math.max(10, (this.stat(player, 'str')
                + this.stat(player, 'dex')) / 2);
    };
    StatCalculator.avoidHit = function (player) {
        return (1 + (this.stat(player, 'defense') * 0.1) +
            (this.stat(player, 'glowing') * 0.05)) *
            (this.stat(player, 'agi')
                + this.stat(player, 'dex')
                + this.stat(player, 'con')
                + this.stat(player, 'int')) / 16;
    };
    StatCalculator.deflect = function (player) {
        return this.stat(player, 'luk');
    };
    StatCalculator.itemValueMultiplier = function (player) {
        var baseValue = settings_1.SETTINGS.reductionDefaults.itemValueMultiplier;
        var reducedValue = this.stat(player, 'itemValueMultiplier', baseValue, false);
        return reducedValue;
    };
    StatCalculator.itemFindRange = function (player) {
        var baseValue = (player.level + 1) * settings_1.SETTINGS.reductionDefaults.itemFindRange;
        var reducedValue = this.stat(player, 'itemFindRange', baseValue, false);
        return Math.floor(reducedValue * this.itemFindRangeMultiplier(player));
    };
    StatCalculator.itemFindRangeMultiplier = function (player) {
        var baseValue = 1 + (0.2 * Math.floor(player.level / 10)) + settings_1.SETTINGS.reductionDefaults.itemFindRangeMultiplier;
        return this.stat(player, 'itemFindRangeMultiplier', baseValue, false);
    };
    StatCalculator.merchantItemGeneratorBonus = function (player) {
        var baseValue = settings_1.SETTINGS.reductionDefaults.merchantItemGeneratorBonus;
        return this._reduction('merchantItemGeneratorBonus', [player], baseValue);
    };
    StatCalculator.merchantCostReductionMultiplier = function (player) {
        var baseValue = settings_1.SETTINGS.reductionDefaults.merchantCostReductionMultiplier;
        return this._reduction('merchantCostReductionMultiplier', [player], baseValue);
    };
    StatCalculator.isStunned = function (player) {
        var isStunned = _.filter(player.$effects.effects, function (effect) { return effect.stun; });
        if (isStunned.length > 0) {
            return isStunned[0].stunMessage || 'NO STUN MESSAGE';
        }
    };
    return StatCalculator;
}());
exports.StatCalculator = StatCalculator;
