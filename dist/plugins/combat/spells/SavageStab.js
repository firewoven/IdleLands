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
var stat_calculator_1 = require("../../../shared/stat-calculator");
var SavageStab = (function (_super) {
    __extends(SavageStab, _super);
    function SavageStab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SavageStab.shouldCast = function (caster) {
        return _.includes(['wombo combo', 'heartbleed'], caster.$lastComboSkill);
    };
    SavageStab.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    SavageStab.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.15;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.25;
        return this.minMax(min, max) * this.spellPower;
    };
    SavageStab.prototype.calcDuration = function () {
        return 2;
    };
    SavageStab.prototype.calcPotency = function () {
        return 1;
    };
    SavageStab.prototype.preCast = function () {
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
            _super.prototype.applyCombatEffects.call(_this, stat_calculator_1.ATTACK_STATS, target);
        });
    };
    return SavageStab;
}(spell_1.Spell));
SavageStab.element = spell_1.SpellType.PHYSICAL;
SavageStab.stat = 'special';
SavageStab.tiers = [
    { name: 'savage stab', spellPower: 1, weight: 30, cost: 30, level: 45, profession: 'Rogue' },
    { name: 'savage stab', spellPower: 2, weight: 30, cost: 30, level: 105, profession: 'Rogue',
        collectibles: ['Thief\'s Locket'] }
];
exports.SavageStab = SavageStab;
