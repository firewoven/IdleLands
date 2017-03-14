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
var Cookie_1 = require("../effects/Cookie");
var FoodFight = (function (_super) {
    __extends(FoodFight, _super);
    function FoodFight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FoodFight.shouldCast = function () {
        return this.$canTarget.yes();
    };
    FoodFight.prototype.determineTargets = function () {
        return this.$targetting.allAlive;
    };
    FoodFight.prototype.calcDamage = function () {
        var min = this.caster.liveStats.dex / 8;
        var max = this.caster.liveStats.dex / 4;
        return this.minMax(min, max) * this.spellPower;
    };
    FoodFight.prototype.calcPotency = function () {
        return this.spellPower;
    };
    FoodFight.prototype.calcDuration = function () {
        return spell_1.Spell.chance.integer({ min: 2, max: 5 }) + this.spellPower;
    };
    FoodFight.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = 0;
            var message = '%player started a %spellName!';
            if (spell_1.Spell.chance.bool({ likelihood: 90 })) {
                var sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
                if (spell_1.Spell.chance.bool({ likelihood: 75 })) {
                    damage = _this.calcDamage();
                    message = message + " %targetName got hit with %item and took %damage damage!";
                }
                else {
                    message = message + " %targetName barely avoided getting hit with %item, but ate it anyway.";
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
            }
            else {
                message = message + " %targetName caught a cookie!";
                _super.prototype.cast.call(_this, {
                    damage: damage,
                    message: message,
                    applyEffect: Cookie_1.Cookie,
                    applyEffectName: 'cookie',
                    targets: [_this.caster]
                });
            }
        });
    };
    return FoodFight;
}(spell_1.Spell));
FoodFight.element = spell_1.SpellType.PHYSICAL;
FoodFight.tiers = [
    { name: 'food fight', spellPower: 1, weight: 30, cost: 500, level: 20, profession: 'SandwichArtist' },
    { name: 'food melee', spellPower: 2, weight: 30, cost: 1500, level: 50, profession: 'SandwichArtist' },
    { name: 'food brawl', spellPower: 3, weight: 30, cost: 3500, level: 75, profession: 'SandwichArtist' }
];
exports.FoodFight = FoodFight;
