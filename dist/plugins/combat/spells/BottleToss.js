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
var BottleToss = (function (_super) {
    __extends(BottleToss, _super);
    function BottleToss() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BottleToss.shouldCast = function (caster) {
        return caster.special > 9;
    };
    BottleToss.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    BottleToss.prototype.calcDamage = function () {
        var drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 1.5 : 1;
        var bottlesBonus = (this.caster._special.asPercent() / 100) * this.caster.liveStats.con;
        var min = (bottlesBonus + this.caster.liveStats.str) * 0.35 * drunkMultiplier;
        var max = (bottlesBonus + this.caster.liveStats.str) * 0.85 * drunkMultiplier;
        return this.minMax(min, max) * this.spellPower;
    };
    BottleToss.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing "99 bottles of ale on the wall..."!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                targets: [target]
            });
            var tosses = 0;
            while (tosses === 0 || (_this.caster.special > 9 && spell_1.Spell.chance.bool({ likelihood: 50 }))) {
                tosses++;
                _super.prototype.cast.call(_this, {
                    damage: _this.calcDamage(),
                    message: '%player threw 9 bottles at %targetName, dealing %damage damage!',
                    targets: [target]
                });
                _this.caster._special.sub(9);
            }
        });
    };
    return BottleToss;
}(spell_1.Spell));
BottleToss.description = 'Throw a bottle at a target, dealing damage based on STR, CON, and # of Bottles. Has a chance of throwing multiple bottles. Requires and consumes 9 bottles each throw. Deals 1.5x damage if the Drunk personality is activated.';
BottleToss.element = spell_1.SpellType.DEBUFF;
BottleToss.stat = 'special';
BottleToss.tiers = [
    { name: 'bottle toss', spellPower: 1, weight: 25, cost: 0, profession: 'Pirate', level: 1 }
];
exports.BottleToss = BottleToss;
