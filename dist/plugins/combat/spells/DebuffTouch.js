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
var DebuffTouch = (function (_super) {
    __extends(DebuffTouch, _super);
    function DebuffTouch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DebuffTouch.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Poison');
    };
    DebuffTouch.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('Poison');
    };
    DebuffTouch.prototype.calcDamage = function (target) {
        if (this.spellPower < 4 || target.$isBoss)
            return 0;
        var min = target.hp * 0.15;
        var max = target.hp * 0.25;
        return this.minMax(min, max);
    };
    DebuffTouch.prototype.calcDuration = function () {
        return 3;
    };
    DebuffTouch.prototype.calcPotency = function () {
        return 1;
    };
    DebuffTouch.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        var effects = ['poison'];
        if (this.spellPower > 1)
            effects.push('prone');
        if (this.spellPower > 2)
            effects.push('venom');
        _.each(targets, function (target) {
            var damage = _this.calcDamage(target);
            var message = '%player used %spellName on %targetName!';
            if (damage > 0) {
                _this.caster.$battle.healDamage(_this.caster, damage, target);
                message = '%player used %spellName on %targetName and drained %damage hp!';
            }
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
            _super.prototype.applyCombatEffects.call(_this, effects, target);
        });
    };
    return DebuffTouch;
}(spell_1.Spell));
DebuffTouch.element = spell_1.SpellType.DEBUFF;
DebuffTouch.tiers = [
    { name: 'poisontouch', spellPower: 1, weight: 30, cost: 500, level: 15, profession: 'Necromancer' },
    { name: 'stuntouch', spellPower: 2, weight: 30, cost: 1700, level: 35, profession: 'Necromancer' },
    { name: 'venomtouch', spellPower: 3, weight: 30, cost: 3800, level: 55, profession: 'Necromancer' },
    { name: 'deathtouch', spellPower: 4, weight: 30, cost: 7500, level: 85, profession: 'Necromancer',
        collectibles: ['Forbidden Cleric\'s Text'] }
];
exports.DebuffTouch = DebuffTouch;
