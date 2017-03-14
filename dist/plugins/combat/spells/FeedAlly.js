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
var FeedAlly = (function (_super) {
    __extends(FeedAlly, _super);
    function FeedAlly() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FeedAlly.shouldCast = function () {
        return this.$canTarget.yes();
    };
    FeedAlly.prototype.determineTargets = function () {
        return this.$targetting.randomAlly;
    };
    FeedAlly.prototype.calcDamage = function () {
        var min = this.caster.liveStats.dex / 5;
        var max = this.caster.liveStats.dex;
        return -this.minMax(min, max) * this.spellPower;
    };
    FeedAlly.prototype.calcPotency = function () {
        return 10;
    };
    FeedAlly.prototype.calcDuration = function () {
        return this.spellPower + 3;
    };
    FeedAlly.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            var sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            var message = '%player served %targetName a %item, healing %healed hp!';
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                messageData: { item: sandwich.name },
                applyEffect: Sandwich_1.Sandwich,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                targets: [target]
            });
            if (target === _this.caster)
                return;
            var sandwichRating = spell_1.Spell.chance.integer({ min: 1, max: 7 });
            if (sandwichRating < 5) {
                _super.prototype.cast.call(_this, {
                    damage: 0,
                    message: '%targetName rated the sandwich poorly, and %player eats the cookie instead!',
                    targets: [target]
                });
                _super.prototype.cast.call(_this, {
                    damage: 0,
                    applyEffect: Cookie_1.Cookie,
                    applyEffectName: 'cookie',
                    targets: [_this.caster]
                });
            }
            else {
                _super.prototype.cast.call(_this, {
                    damage: 0,
                    message: '%targetName rated the sandwich at at least a 5/7, and gets a free cookie!',
                    applyEffect: Cookie_1.Cookie,
                    applyEffectName: 'cookie',
                    targets: [target]
                });
            }
        });
    };
    return FeedAlly;
}(spell_1.Spell));
FeedAlly.element = spell_1.SpellType.PHYSICAL;
FeedAlly.tiers = [
    { name: 'feed ally', spellPower: 1, weight: 30, cost: 50, level: 20, profession: 'SandwichArtist' },
    { name: 'stuff ally', spellPower: 2, weight: 30, cost: 500, level: 50, profession: 'SandwichArtist' }
];
exports.FeedAlly = FeedAlly;
