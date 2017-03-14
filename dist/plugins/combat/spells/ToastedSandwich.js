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
var sandwich_generator_1 = require("../../../shared/sandwich-generator");
var Sandwich_1 = require("../effects/Sandwich");
var ToastedSandwich = (function (_super) {
    __extends(ToastedSandwich, _super);
    function ToastedSandwich() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToastedSandwich.shouldCast = function () {
        return this.$canTarget.yes();
    };
    ToastedSandwich.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    ToastedSandwich.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
        var max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    ToastedSandwich.prototype.calcPotency = function () {
        return 1;
    };
    ToastedSandwich.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    ToastedSandwich.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = 0;
            var sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            var message = '%player served %targetName a %item.';
            if (spell_1.Spell.chance.bool({ likelihood: 75 })) {
                sandwich.name = _this.tier.name + " " + sandwich.name;
                sandwich.con -= _this.spellPower * 100;
                sandwich.dex -= _this.spellPower * 100;
                sandwich.agi -= _this.spellPower * 100;
                damage = _this.calcDamage();
                message = message + " %targetName wanted it toasted and got burned for %damage damage!";
            }
            else {
                message = message + " %targetName didn't want it toasted.";
            }
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                messageData: { item: sandwich.name },
                applyEffect: Sandwich_1.Sandwich,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                targets: [target]
            });
        });
    };
    return ToastedSandwich;
}(spell_1.Spell));
ToastedSandwich.element = spell_1.SpellType.FIRE;
ToastedSandwich.tiers = [
    { name: 'toasted', spellPower: 1, weight: 30, cost: 125, level: 10, profession: 'SandwichArtist' },
    { name: 'burnt', spellPower: 2, weight: 30, cost: 1300, level: 40, profession: 'SandwichArtist' },
    { name: 'well-done', spellPower: 3, weight: 30, cost: 6500, level: 90, profession: 'SandwichArtist' }
];
exports.ToastedSandwich = ToastedSandwich;
