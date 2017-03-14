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
var DrunkenFrenzy = (function (_super) {
    __extends(DrunkenFrenzy, _super);
    function DrunkenFrenzy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DrunkenFrenzy.shouldCast = function (caster) {
        return caster.$effects.hasEffect('DrunkenStupor') || caster.$drunk.gtePercent(65);
    };
    DrunkenFrenzy.prototype.calcDamage = function () {
        var drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
        var min = this.caster.liveStats.str * 0.75 * drunkMultiplier;
        var max = this.caster.liveStats.str * 1.5 * drunkMultiplier;
        return this.minMax(min, max) * this.spellPower;
    };
    DrunkenFrenzy.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    DrunkenFrenzy.prototype.preCast = function () {
        var _this = this;
        var message = '%player went off on a %spellName at %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 30, max: 40 }));
        this.caster.$drunk.sub(10);
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return DrunkenFrenzy;
}(spell_1.Spell));
DrunkenFrenzy.description = 'Drunkenly ravages a random enemy, dealing 2x damage if the personality Drunk is activated. Reduces drunkenness by 10% and replenishes bottle count by 30-40.';
DrunkenFrenzy.element = spell_1.SpellType.PHYSICAL;
DrunkenFrenzy.tiers = [
    { name: 'drunken frenzy', spellPower: 1, weight: 60, cost: 0, level: 30, profession: 'Pirate' }
];
exports.DrunkenFrenzy = DrunkenFrenzy;
