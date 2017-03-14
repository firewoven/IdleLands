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
var Stuffed_1 = require("../effects/Stuffed");
var DayOldBread = (function (_super) {
    __extends(DayOldBread, _super);
    function DayOldBread() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DayOldBread.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Stuffed');
    };
    DayOldBread.prototype.determineTargets = function () {
        return this.$targetting.randomEnemyWithoutEffect('Stuffed');
    };
    DayOldBread.prototype.calcDamage = function () {
        var min = this.caster.liveStats.dex / 8;
        var max = this.caster.liveStats.dex / 6;
        return this.minMax(min, max) * this.spellPower;
    };
    DayOldBread.prototype.calcPotency = function () {
        return 100;
    };
    DayOldBread.prototype.calcDuration = function () {
        return this.spellPower;
    };
    DayOldBread.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var damage = _this.calcDamage();
            var sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            sandwich.name = _this.tier.name + " " + sandwich.name;
            sandwich.con -= 50;
            var message = '%player served %targetName a %item, causing %targetName to fall over and take %damage damage!';
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                messageData: { item: sandwich.name },
                applyEffect: Stuffed_1.Stuffed,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                targets: [target]
            });
        });
    };
    return DayOldBread;
}(spell_1.Spell));
DayOldBread.element = spell_1.SpellType.PHYSICAL;
DayOldBread.tiers = [
    { name: 'day-old', spellPower: 1, weight: 30, cost: 35, level: 5, profession: 'SandwichArtist' },
    { name: 'week-old', spellPower: 2, weight: 30, cost: 650, level: 50, profession: 'SandwichArtist' },
    { name: 'month-old', spellPower: 3, weight: 30, cost: 2500, level: 100, profession: 'SandwichArtist',
        collectibles: ['Funny Fungus'] },
    { name: 'second-old', spellPower: 1, weight: 30, cost: 500, level: 30, profession: 'MagicalMonster',
        collectibles: ['Funny Fungus'] }
];
exports.DayOldBread = DayOldBread;
