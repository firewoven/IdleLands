"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messagecreator_1 = require("../../plugins/events/messagecreator");
var logger_1 = require("../../shared/logger");
var Chance = require("chance");
var chance = new Chance();
var Effect = (function () {
    function Effect(_a) {
        var target = _a.target, extra = _a.extra, duration = _a.duration, potency = _a.potency;
        this.target = target;
        this.extra = extra;
        this.potency = this._potency = potency;
        this.duration = this._duration = duration;
        if (duration <= 0 || !potency) {
            logger_1.Logger.error('Effect', new Error('Bad duration or potency given for effect.'), { name: this.constructor.name, duration: duration, potency: potency });
        }
    }
    Object.defineProperty(Effect, "chance", {
        get: function () { return chance; },
        enumerable: true,
        configurable: true
    });
    Effect.prototype._emitMessage = function (player, message, extraData) {
        if (extraData === void 0) { extraData = {}; }
        extraData.casterName = this.origin.name;
        extraData.spellName = this.origin.spell;
        var parsedMessage = messagecreator_1.MessageParser.stringFormat(message, player, extraData);
        this.target.$battle._emitMessage(parsedMessage);
    };
    Effect.prototype.statByPercent = function (player, stat, percent) {
        return Math.round(player.liveStats[stat] * percent / 100);
    };
    Effect.prototype.dealDamage = function (player, damage, message, extraData) {
        if (extraData === void 0) { extraData = {}; }
        var source = this.origin.ref;
        damage = player.$battle.dealDamage(player, damage, source);
        if (message) {
            extraData.damage = damage;
            this._emitMessage(player, message, extraData);
        }
        if (player.hp === 0) {
            this.target.$battle.handleDeath(player, source);
        }
        return damage;
    };
    Effect.prototype.tick = function () {
        this.duration--;
    };
    Effect.prototype.affect = function () { };
    Effect.prototype.unaffect = function () {
        this._emitMessage(this.target, 'The effect of %casterName\'s %spellName on %player has dissipated.');
    };
    Effect.prototype.setStat = function (target, stat, value) {
        this[stat] = value;
        if (target.$dirty) {
            target.$dirty.flags[stat] = true;
        }
    };
    return Effect;
}());
exports.Effect = Effect;
