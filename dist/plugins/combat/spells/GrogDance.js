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
var DEXBoost_1 = require("../effects/DEXBoost");
var GrogDance = (function (_super) {
    __extends(GrogDance, _super);
    function GrogDance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GrogDance.shouldCast = function (caster) {
        return !caster.$effects.hasEffect('DEXBoost') && caster._special.ltePercent(30) && !caster.$effects.hasEffect('DrunkenStupor');
    };
    GrogDance.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    GrogDance.prototype.calcDuration = function () {
        return 3;
    };
    GrogDance.prototype.calcPotency = function () {
        return this.caster._special.maximum - this.caster.special;
    };
    GrogDance.prototype.preCast = function () {
        var _this = this;
        var message = '%player does a %spellName!';
        var targets = this.determineTargets();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 15, max: 45 }));
        this.caster.$drunk.add(25);
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: DEXBoost_1.DEXBoost,
                targets: [target]
            });
        });
    };
    return GrogDance;
}(spell_1.Spell));
GrogDance.description = 'Dances like a pirate, increasing DEX and replenishing bottle count by 15-45. Also increases drunkenness by 25%';
GrogDance.element = spell_1.SpellType.PHYSICAL;
GrogDance.stat = 'special';
GrogDance.tiers = [
    { name: 'grog dance', spellPower: 1, weight: 25, cost: 0, profession: 'Pirate', level: 37 }
];
exports.GrogDance = GrogDance;
