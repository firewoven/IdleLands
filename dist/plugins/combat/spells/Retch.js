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
var Retch = (function (_super) {
    __extends(Retch, _super);
    function Retch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Retch.shouldCast = function (caster) {
        return caster.$effects.hasEffect('DrunkenStupor') || caster.$drunk.gtePercent(75);
    };
    Retch.prototype.calcDamage = function () {
        var drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
        var min = this.caster.liveStats.str * 0.50 * drunkMultiplier;
        var max = this.caster.liveStats.str * 0.75 * drunkMultiplier;
        return this.minMax(min, max) * this.spellPower;
    };
    Retch.prototype.determineTargets = function () {
        return this.$targetting.allEnemies;
    };
    Retch.prototype.preCast = function () {
        var _this = this;
        var message = '%player %spellName\'d all over %targetName and dealt %damage damage!';
        var targets = this.determineTargets();
        this.caster.$drunk.toMinimum();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 20, max: 30 }));
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return Retch;
}(spell_1.Spell));
Retch.element = spell_1.SpellType.PHYSICAL;
Retch.tiers = [
    { name: 'retch', spellPower: 1, weight: 80, cost: 0, level: 40, profession: 'Pirate' },
    { name: 'vomit', spellPower: 2, weight: 80, cost: 0, level: 80, profession: 'Pirate' },
    { name: 'explosive vomit', spellPower: 3, weight: 80, cost: 0, level: 120, profession: 'Pirate',
        collectibles: ['Unpleasant Glass of Water'] }
];
exports.Retch = Retch;
