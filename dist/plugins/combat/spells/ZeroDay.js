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
var ZeroDay_1 = require("../effects/ZeroDay");
var ZeroDay = (function (_super) {
    __extends(ZeroDay, _super);
    function ZeroDay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZeroDay.shouldCast = function (caster) {
        return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'ZeroDay');
    };
    ZeroDay.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyNotProfession('Bitomancer');
    };
    ZeroDay.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    ZeroDay.prototype.calcPotency = function () {
        return this.spellPower * 100;
    };
    ZeroDay.prototype.preCast = function () {
        var _this = this;
        var message = '%player executed a %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: ZeroDay_1.ZeroDay,
                targets: [target]
            });
        });
    };
    return ZeroDay;
}(spell_1.Spell));
ZeroDay.element = spell_1.SpellType.DIGITAL;
ZeroDay.stat = 'special';
ZeroDay.tiers = [
    { name: 'zero-day threat', spellPower: 1, weight: 40, cost: 64, level: 32, profession: 'Bitomancer' },
    { name: 'zero-day attack', spellPower: 5, weight: 40, cost: 128, level: 64, profession: 'Bitomancer' },
    { name: 'zero-day assault', spellPower: 10, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Vial of Liquid Fate'] }
];
exports.ZeroDay = ZeroDay;
