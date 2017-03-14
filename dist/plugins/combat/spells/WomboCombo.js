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
var WomboCombo = (function (_super) {
    __extends(WomboCombo, _super);
    function WomboCombo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WomboCombo.shouldCast = function (caster) {
        return _.includes(['chain stab', 'heartbleed'], caster.$lastComboSkill);
    };
    WomboCombo.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    WomboCombo.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.8;
        return this.minMax(min, max) * this.spellPower;
    };
    WomboCombo.prototype.preCast = function () {
        var _this = this;
        this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            for (var i = 0; i < 3; i++) {
                var damage = _this.calcDamage();
                _super.prototype.cast.call(_this, {
                    damage: damage,
                    message: message,
                    targets: [target]
                });
            }
        });
    };
    return WomboCombo;
}(spell_1.Spell));
WomboCombo.element = spell_1.SpellType.PHYSICAL;
WomboCombo.stat = 'special';
WomboCombo.tiers = [
    { name: 'wombo combo', spellPower: 1, weight: 30, cost: 25, level: 25, profession: 'Rogue' },
    { name: 'wombo combo', spellPower: 2, weight: 30, cost: 25, level: 85, profession: 'Rogue' }
];
exports.WomboCombo = WomboCombo;
