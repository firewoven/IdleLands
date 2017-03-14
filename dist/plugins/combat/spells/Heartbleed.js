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
var Heartbleed_1 = require("../effects/Heartbleed");
var Heartbleed = (function (_super) {
    __extends(Heartbleed, _super);
    function Heartbleed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heartbleed.shouldCast = function (caster) {
        return _.includes(['chain stab'], caster.$lastComboSkill);
    };
    Heartbleed.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Heartbleed.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.15;
        var max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.45;
        return this.minMax(min, max) * this.spellPower;
    };
    Heartbleed.prototype.calcDuration = function () {
        return 2;
    };
    Heartbleed.prototype.calcPotency = function () {
        return 1;
    };
    Heartbleed.prototype.preCast = function () {
        var _this = this;
        this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
        var message = '%player used %spellName on %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                applyEffect: Heartbleed_1.Heartbleed,
                targets: [target]
            });
        });
    };
    return Heartbleed;
}(spell_1.Spell));
Heartbleed.element = spell_1.SpellType.PHYSICAL;
Heartbleed.stat = 'special';
Heartbleed.tiers = [
    { name: 'heartbleed', spellPower: 1, weight: 30, cost: 15, level: 15, profession: 'Rogue' },
    { name: 'heartbleed', spellPower: 2, weight: 30, cost: 15, level: 75, profession: 'Rogue' }
];
exports.Heartbleed = Heartbleed;
