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
var Shattershot = (function (_super) {
    __extends(Shattershot, _super);
    function Shattershot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shattershot.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Shatter');
    };
    Shattershot.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Shattershot.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str + (this.caster.liveStats.dex * 0.5)) * 0.2;
        var max = (this.caster.liveStats.str + (this.caster.liveStats.dex * 0.5)) * 0.4;
        return this.minMax(min, max) * (this.spellPower);
    };
    Shattershot.prototype.calcDuration = function () {
        return 2;
    };
    Shattershot.prototype.calcPotency = function () {
        return 1;
    };
    Shattershot.prototype.preCast = function () {
        var _this = this;
        var message = '%player knocked %targetName to the floor using a %spellName, dealing %damage damage!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
            _super.prototype.applyCombatEffects.call(_this, _.sampleSize(stat_calculator_1.ATTACK_STATS, _this.spellPower + 1), target);
        });
    };
    return Shattershot;
}(spell_1.Spell));
Shattershot.element = spell_1.SpellType.PHYSICAL;
Shattershot.stat = 'special';
Shattershot.tiers = [
    { name: 'shattershot', spellPower: 1, weight: 30, cost: 25, level: 25, profession: 'Archer' },
    { name: 'shatterblast', spellPower: 2, weight: 30, cost: 35, level: 65, profession: 'Archer' }
];
exports.Shattershot = Shattershot;
