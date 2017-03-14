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
var LitanyOfPain_1 = require("../effects/LitanyOfPain");
var LitanyOfPain = (function (_super) {
    __extends(LitanyOfPain, _super);
    function LitanyOfPain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LitanyOfPain.shouldCast = function (caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'LitanyOfPain');
    };
    LitanyOfPain.prototype.determineTargets = function () {
        return this.$targetting.allEnemies;
    };
    LitanyOfPain.prototype.calcDuration = function () {
        return 2 + this.spellPower;
    };
    LitanyOfPain.prototype.calcPotency = function () {
        var min = this.caster.liveStats.int / 7;
        var max = this.caster.liveStats.int / 5;
        return this.minMax(min, max) * this.spellPower;
    };
    LitanyOfPain.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: LitanyOfPain_1.LitanyOfPain,
                targets: [target]
            });
        });
    };
    return LitanyOfPain;
}(spell_1.Spell));
LitanyOfPain.element = spell_1.SpellType.DEBUFF;
LitanyOfPain.tiers = [
    { name: 'Litany of Pain', spellPower: 1, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'Hymn of Torment', spellPower: 2, weight: 25, cost: 2000, profession: 'Bard', level: 50 },
    { name: 'Chant of Obliteration', spellPower: 3, weight: 25, cost: 7500, profession: 'Bard', level: 100,
        collectibles: ['Ancient Lute'] },
    { name: 'Song of Hurt', spellPower: 1, weight: 25, cost: 1000, profession: 'MagicalMonster', level: 25,
        collectibles: ['Ancient Lute'] }
];
exports.LitanyOfPain = LitanyOfPain;
