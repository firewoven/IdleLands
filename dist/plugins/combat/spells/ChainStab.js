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
var ChainStab = (function (_super) {
    __extends(ChainStab, _super);
    function ChainStab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainStab.shouldCast = function (caster) {
        return _.includes(['opening strike', 'backstab', 'chain stab'], caster.$lastComboSkill);
    };
    ChainStab.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    ChainStab.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.35;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.45;
        return this.minMax(min, max) * this.spellPower;
    };
    ChainStab.prototype.preCast = function () {
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
    return ChainStab;
}(spell_1.Spell));
ChainStab.element = spell_1.SpellType.PHYSICAL;
ChainStab.stat = 'special';
ChainStab.tiers = [
    { name: 'chain stab', spellPower: 1, weight: 20, cost: 7, level: 8, profession: 'Rogue' },
    { name: 'chain stab', spellPower: 2, weight: 20, cost: 7, level: 68, profession: 'Rogue' }
];
exports.ChainStab = ChainStab;
