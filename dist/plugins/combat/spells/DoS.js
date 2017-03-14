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
var DoS_1 = require("../effects/DoS");
var DoS = (function (_super) {
    __extends(DoS, _super);
    function DoS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoS.shouldCast = function (caster) {
        return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'DoS');
    };
    DoS.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyNotProfession('Bitomancer');
    };
    DoS.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    DoS.prototype.calcPotency = function () {
        return this.spellPower * 30;
    };
    DoS.prototype.preCast = function () {
        var _this = this;
        var message = '%player executed a %spellName attack on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DoS_1.DoS,
                targets: [target]
            });
        });
    };
    return DoS;
}(spell_1.Spell));
DoS.element = spell_1.SpellType.DIGITAL;
DoS.stat = 'special';
DoS.tiers = [
    { name: 'DoS', spellPower: 1, weight: 40, cost: 64, level: 32, profession: 'Bitomancer' },
    { name: 'DDoS', spellPower: 2, weight: 40, cost: 128, level: 64, profession: 'Bitomancer' },
    { name: 'persistent DDoS', spellPower: 3, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Gauntlet'] }
];
exports.DoS = DoS;
