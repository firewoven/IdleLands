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
var Backstab = (function (_super) {
    __extends(Backstab, _super);
    function Backstab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Backstab.shouldCast = function (caster) {
        return _.includes(['opening strike'], caster.$lastComboSkill);
    };
    Backstab.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Backstab.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.7;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.1;
        return this.minMax(min, max) * this.spellPower;
    };
    Backstab.prototype.preCast = function () {
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
    return Backstab;
}(spell_1.Spell));
Backstab.element = spell_1.SpellType.PHYSICAL;
Backstab.stat = 'special';
Backstab.tiers = [
    { name: 'backstab', spellPower: 1, weight: 30, cost: 15, level: 8, profession: 'Rogue' },
    { name: 'backstab', spellPower: 2, weight: 30, cost: 15, level: 68, profession: 'Rogue' }
];
exports.Backstab = Backstab;
