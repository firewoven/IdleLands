"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var spelltargetstrategy_1 = require("./spelltargetstrategy");
var spelltargetpossibilities_1 = require("./spelltargetpossibilities");
var messagecreator_1 = require("../../plugins/events/messagecreator");
var Chance = require("chance");
var chance = new Chance();
var isValidSpellTierProfession = function (tier, caster) {
    return (tier.profession === caster.professionName
        || (caster.$secondaryProfessions && _.includes(caster.$secondaryProfessions, tier.profession)));
};
var Spell = (function () {
    function Spell(caster) {
        var _this = this;
        this.caster = caster;
        this.$targetting = new Proxy({}, {
            get: function (target, name) {
                return spelltargetstrategy_1.SpellTargetStrategy[name](_this.caster);
            }
        });
    }
    Object.defineProperty(Spell, "chance", {
        get: function () { return chance; },
        enumerable: true,
        configurable: true
    });
    Spell.bestTier = function (caster) {
        var collectibleCheck = caster.$ownerRef ? caster.$ownerRef : caster;
        return _.last(_.filter(this.tiers, function (tier) {
            var meetsCollectibleReqs = tier.collectibles ? _.every(tier.collectibles, function (c) { return !collectibleCheck.$collectibles || collectibleCheck.$collectibles.hasCollectible(c); }) : true;
            return isValidSpellTierProfession(tier, caster) && tier.level <= caster.level && meetsCollectibleReqs;
        }));
    };
    Object.defineProperty(Spell.prototype, "tier", {
        get: function () {
            var _this = this;
            var tiers = this.constructor.tiers;
            var collectibleCheck = this.caster.$ownerRef ? this.caster.$ownerRef : this.caster;
            return _.last(_.filter(tiers, function (tier) {
                var meetsCollectibleReqs = tier.collectibles ? _.every(tier.collectibles, function (c) { return !collectibleCheck.$collectibles || collectibleCheck.$collectibles.hasCollectible(c); }) : true;
                return isValidSpellTierProfession(tier, _this.caster) && tier.level <= _this.caster.level && meetsCollectibleReqs;
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spell.prototype, "stat", {
        get: function () {
            return this.constructor.stat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spell.prototype, "oper", {
        get: function () {
            return this.constructor.oper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spell.prototype, "element", {
        get: function () {
            return this.constructor.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spell.prototype, "spellPower", {
        get: function () {
            return this.tier.spellPower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Spell.prototype, "cost", {
        get: function () {
            return this.tier.cost;
        },
        enumerable: true,
        configurable: true
    });
    Spell.prototype.calcDamage = function () {
        return 0;
    };
    Spell.prototype.calcDuration = function () {
        return 0;
    };
    Spell.prototype.calcPotency = function () {
        return 0;
    };
    Spell.prototype.determineTargets = function () {
        return [];
    };
    Spell.prototype._emitMessage = function (player, message, extraData) {
        if (extraData === void 0) { extraData = {}; }
        return messagecreator_1.MessageParser.stringFormat(message, player, extraData);
    };
    Spell.prototype.cast = function (_a) {
        var _this = this;
        var damage = _a.damage, targets = _a.targets, message = _a.message, applyEffect = _a.applyEffect, applyEffectDuration = _a.applyEffectDuration, applyEffectPotency = _a.applyEffectPotency, applyEffectName = _a.applyEffectName, applyEffectExtra = _a.applyEffectExtra, _b = _a.messageData, messageData = _b === void 0 ? {} : _b;
        this.caster.$battle.tryIncrement(this.caster, "Combat.Utilize." + this.element);
        damage = Math.round(damage);
        this.caster["_" + this.stat][this.oper](this.cost);
        messageData.spellName = this.tier.name;
        if (!targets.length) {
            this.caster.$battle._emitMessage(this._emitMessage(this.caster, message, messageData));
            return;
        }
        _.each(targets, function (target) {
            messageData.targetName = target.fullname;
            _this.caster.$battle.emitEvents(_this.caster, 'Attack');
            _this.caster.$battle.emitEvents(target, 'Attacked');
            var wasAlive = target.hp > 0;
            if (damage !== 0) {
                damage = _this.dealDamage(target, damage);
            }
            messageData.damage = damage.toLocaleString();
            messageData.healed = Math.abs(damage).toLocaleString();
            // TODO mark an attack as fatal somewhere else in metadata and display metadata on site
            if (message) {
                _this.caster.$battle._emitMessage(_this._emitMessage(_this.caster, message, messageData));
            }
            // Target was killed by this attack. Prevents double counting of kills.
            if (wasAlive && target.hp === 0) {
                _this.caster.$battle.handleDeath(target, _this.caster);
            }
            if (applyEffect && target.hp > 0) {
                var effect = new applyEffect({ target: target, extra: applyEffectExtra, potency: applyEffectPotency || _this.calcPotency(), duration: applyEffectDuration || _this.calcDuration() });
                effect.origin = { name: _this.caster.fullname, ref: _this.caster, spell: applyEffectName || _this.tier.name };
                target.$effects.add(effect);
                effect.affect(target);
                _this.caster.$battle.tryIncrement(_this.caster, "Combat.Give.Effect." + _this.element);
                _this.caster.$battle.tryIncrement(target, "Combat.Receive.Effect." + _this.element);
            }
        });
    };
    Spell.prototype.preCast = function () { };
    Spell.prototype.dealDamage = function (target, damage) {
        return this.caster.$battle.dealDamage(target, damage, this.caster);
    };
    Spell.prototype.minMax = function (min, max) {
        return Math.max(1, Spell.chance.integer({ min: min, max: Math.max(min + 1, max) }));
    };
    Spell.prototype.applyCombatEffects = function (effects, target) {
        var _this = this;
        _.each(effects, function (stat) {
            var properEffect = _.capitalize(stat);
            var effect = require("./effects/" + properEffect)[properEffect];
            var potencyBonus = _this.caster.liveStats[stat];
            if (potencyBonus < 0)
                potencyBonus = 0;
            _this.cast({
                damage: 0,
                message: '',
                applyEffect: effect,
                applyEffectName: stat,
                applyEffectPotency: 1 + potencyBonus,
                applyEffectDuration: stat === 'prone' ? 1 : _this.calcDuration(),
                targets: [target]
            });
        });
    };
    return Spell;
}());
Spell.tiers = [];
Spell.$canTarget = spelltargetpossibilities_1.SpellTargetPossibilities;
Spell.stat = 'mp';
Spell.oper = 'sub';
exports.Spell = Spell;
exports.SpellType = {
    PHYSICAL: 'Physical',
    BUFF: 'Buff',
    DEBUFF: 'Debuff',
    HEAL: 'Heal',
    DIGITAL: 'Digital',
    ENERGY: 'Energy',
    HOLY: 'Holy',
    THUNDER: 'Thunder',
    FIRE: 'Fire',
    WATER: 'Water',
    ICE: 'Ice'
};
