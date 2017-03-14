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
var OpeningStrike = (function (_super) {
    __extends(OpeningStrike, _super);
    function OpeningStrike() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpeningStrike.shouldCast = function (caster) {
        return caster.$lastComboSkillTurn <= 0;
    };
    OpeningStrike.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    OpeningStrike.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.25;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
        return this.minMax(min, max) * this.spellPower;
    };
    OpeningStrike.prototype.preCast = function () {
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
    return OpeningStrike;
}(spell_1.Spell));
OpeningStrike.element = spell_1.SpellType.PHYSICAL;
OpeningStrike.stat = 'special';
OpeningStrike.tiers = [
    { name: 'opening strike', spellPower: 1, weight: 30, cost: 10, level: 1, profession: 'Rogue' },
    { name: 'opening strike', spellPower: 2, weight: 30, cost: 10, level: 61, profession: 'Rogue' }
];
exports.OpeningStrike = OpeningStrike;
