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
var Thunderstrike_1 = require("../effects/Thunderstrike");
var Thunderstrike = (function (_super) {
    __extends(Thunderstrike, _super);
    function Thunderstrike() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Thunderstrike.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Thunderstrike');
    };
    Thunderstrike.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('Thunderstrike');
    };
    Thunderstrike.prototype.calcDuration = function () {
        return spell_1.Spell.chance.integer({ min: 1, max: 3 }) + this.spellPower;
    };
    Thunderstrike.prototype.calcPotency = function () {
        var min = this.caster.liveStats.int / 8;
        var max = this.caster.liveStats.int / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    Thunderstrike.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: Thunderstrike_1.Thunderstrike,
                targets: [target]
            });
        });
    };
    return Thunderstrike;
}(spell_1.Spell));
Thunderstrike.element = spell_1.SpellType.THUNDER;
Thunderstrike.tiers = [
    { name: 'thunderstrike', spellPower: 2, weight: 40, cost: 500, level: 35, profession: 'Mage' },
    { name: 'thunderstorm', spellPower: 4, weight: 40, cost: 1500, level: 85, profession: 'Mage' }
];
exports.Thunderstrike = Thunderstrike;
