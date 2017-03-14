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
var AllStatsDown_1 = require("../effects/AllStatsDown");
var Siphon = (function (_super) {
    __extends(Siphon, _super);
    function Siphon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Siphon.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'AllStatsDown');
    };
    Siphon.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('AllStatsDown');
    };
    Siphon.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 8;
        var max = this.caster.liveStats.int / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    Siphon.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    Siphon.prototype.calcPotency = function () {
        return 5 * this.spellPower;
    };
    Siphon.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        var message = '%player used %spellName on %targetName and siphoned %damage hp!';
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            _this.caster.$battle.healDamage(_this.caster, damage, target);
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                applyEffect: AllStatsDown_1.AllStatsDown,
                targets: [target]
            });
        });
    };
    return Siphon;
}(spell_1.Spell));
Siphon.element = spell_1.SpellType.DEBUFF;
Siphon.tiers = [
    { name: 'siphon', spellPower: 2, weight: 30, cost: 100, level: 1, profession: 'Necromancer' },
    { name: 'drain', spellPower: 3, weight: 30, cost: 500, level: 15, profession: 'Necromancer' },
    { name: 'deteriorate', spellPower: 4, weight: 30, cost: 3000, level: 35, profession: 'Necromancer' },
    { name: 'wither', spellPower: 5, weight: 30, cost: 7500, level: 75, profession: 'Necromancer' },
    { name: 'colander', spellPower: 1, weight: 30, cost: 1000, level: 35, profession: 'MagicalMonster',
        collectibles: ['Evil Pebble'] }
];
exports.Siphon = Siphon;
