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
var HolyBolt = (function (_super) {
    __extends(HolyBolt, _super);
    function HolyBolt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HolyBolt.shouldCast = function () {
        return this.$canTarget.yes();
    };
    HolyBolt.prototype.calcDamage = function () {
        var min = this.caster.liveStats.int / 4;
        var max = this.caster.liveStats.int / 2;
        return this.minMax(min, max) * this.spellPower;
    };
    HolyBolt.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    HolyBolt.prototype.preCast = function () {
        var _this = this;
        var message = '%player cast %spellName at %targetName and dealt %damage damage!';
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
    return HolyBolt;
}(spell_1.Spell));
HolyBolt.element = spell_1.SpellType.HOLY;
HolyBolt.tiers = [
    { name: 'holy bolt', spellPower: 3, weight: 40, cost: 10, level: 1, profession: 'Cleric' },
    { name: 'divine bolt', spellPower: 5, weight: 40, cost: 300, level: 25, profession: 'Cleric' },
    { name: 'celestial bolt', spellPower: 7, weight: 40, cost: 1800, level: 55, profession: 'Cleric' }
];
exports.HolyBolt = HolyBolt;
