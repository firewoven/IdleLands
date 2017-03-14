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
var AntimagicArrow = (function (_super) {
    __extends(AntimagicArrow, _super);
    function AntimagicArrow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AntimagicArrow.shouldCast = function (caster) {
        return this.$canTarget.enemyHasMp(caster);
    };
    AntimagicArrow.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.int + (this.caster.liveStats.dex * 0.25)) * 0.2;
        var max = (this.caster.liveStats.int + (this.caster.liveStats.dex * 0.25)) * 0.4;
        return this.minMax(min, max) * this.spellPower;
    };
    AntimagicArrow.prototype.determineTargets = function () {
        return this.$targetting.enemyWithMostMp;
    };
    AntimagicArrow.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            var lostMp = Math.floor(target._mp.maximum * (25 * (_this.spellPower + 1) / 100));
            target._mp.sub(lostMp);
            var message = "%player used an %spellName on %targetName and dealt %damage damage and reduced %targetName's mp by " + lostMp + "!";
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                targets: [target]
            });
        });
    };
    return AntimagicArrow;
}(spell_1.Spell));
AntimagicArrow.element = spell_1.SpellType.PHYSICAL;
AntimagicArrow.stat = 'special';
AntimagicArrow.tiers = [
    { name: 'anti-magic arrow', spellPower: 1, weight: 40, cost: 25, level: 30, profession: 'Archer' },
    { name: 'anti-magic burst', spellPower: 2, weight: 40, cost: 35, level: 65, profession: 'Archer' },
    { name: 'anti-magic blast', spellPower: 3, weight: 40, cost: 45, level: 100, profession: 'Archer',
        collectibles: ['Ivory Arrow'] }
];
exports.AntimagicArrow = AntimagicArrow;
