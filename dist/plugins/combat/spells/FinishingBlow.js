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
var FinishingBlow = (function (_super) {
    __extends(FinishingBlow, _super);
    function FinishingBlow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FinishingBlow.shouldCast = function (caster) {
        return _.includes(['wombo combo', 'savage stab', 'heartbleed'], caster.$lastComboSkill);
    };
    FinishingBlow.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    FinishingBlow.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.45;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 2.25;
        return this.minMax(min, max) * this.spellPower;
    };
    FinishingBlow.prototype.preCast = function () {
        var _this = this;
        this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return FinishingBlow;
}(spell_1.Spell));
FinishingBlow.element = spell_1.SpellType.PHYSICAL;
FinishingBlow.stat = 'special';
FinishingBlow.tiers = [
    { name: 'finishing blow', spellPower: 1, weight: 30, cost: 30, level: 38, profession: 'Rogue' },
    { name: 'finishing blow', spellPower: 2, weight: 30, cost: 30, level: 98, profession: 'Rogue' }
];
exports.FinishingBlow = FinishingBlow;
