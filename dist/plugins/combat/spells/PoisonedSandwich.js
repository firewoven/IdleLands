"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var spell_1 = require("../spell");
var sandwich_generator_1 = require("../../../shared/sandwich-generator");
var PoisonedSandwich_1 = require("../effects/PoisonedSandwich");
var PoisonedSandwich = (function (_super) {
    __extends(PoisonedSandwich, _super);
    function PoisonedSandwich() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PoisonedSandwich.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'PoisonedSandwich');
    };
    PoisonedSandwich.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('PoisonedSandwich');
    };
    PoisonedSandwich.prototype.calcPotency = function () {
        var min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
        var max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    PoisonedSandwich.prototype.calcDuration = function () {
        return this.spellPower;
    };
    PoisonedSandwich.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            sandwich.name = _this.tier.name + " " + sandwich.name;
            sandwich.con -= _this.spellPower * _this.caster.level;
            var message = '%player served %targetName a %item, sickening %targetName!';
            var casterCon = _this.caster.liveStats.con;
            var targetCon = target.liveStats.con;
            var durationBoost = 0;
            if (targetCon < casterCon)
                durationBoost++;
            if (targetCon < casterCon / 2)
                durationBoost++;
            if (targetCon < casterCon / 4)
                durationBoost++;
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                messageData: { item: sandwich.name },
                applyEffect: PoisonedSandwich_1.PoisonedSandwich,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                applyEffectDuration: _this.calcDuration() + durationBoost,
                targets: [target]
            });
        });
    };
    return PoisonedSandwich;
}(spell_1.Spell));
PoisonedSandwich.element = spell_1.SpellType.PHYSICAL;
PoisonedSandwich.tiers = [
    { name: 'poisoned', spellPower: 3, weight: 30, cost: 85, level: 15, profession: 'SandwichArtist' }
];
exports.PoisonedSandwich = PoisonedSandwich;
