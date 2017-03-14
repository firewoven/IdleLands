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
var VenomCoating_1 = require("../effects/VenomCoating");
var VenomCoating = (function (_super) {
    __extends(VenomCoating, _super);
    function VenomCoating() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VenomCoating.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'VenomCoating') && caster._special.ltePercent(30);
    };
    VenomCoating.prototype.determineTargets = function () {
        return this.$targetting.randomAllyWithoutEffect('VenomCoating');
    };
    VenomCoating.prototype.calcDuration = function () {
        return 3 + this.spellPower;
    };
    VenomCoating.prototype.calcPotency = function () {
        return this.spellPower;
    };
    VenomCoating.prototype.preCast = function () {
        var _this = this;
        var message = '%player applied a %spellName on %targetName\'s weapon!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: VenomCoating_1.VenomCoating,
                targets: [target]
            });
        });
    };
    return VenomCoating;
}(spell_1.Spell));
VenomCoating.element = spell_1.SpellType.BUFF;
VenomCoating.tiers = [
    { name: 'venom coating', spellPower: 1, weight: 25, cost: 200, profession: 'Archer', level: 15 },
    { name: 'venom slathering', spellPower: 2, weight: 25, cost: 800, profession: 'Archer', level: 55 },
    { name: 'venom layer', spellPower: 1, weight: 25, cost: 600, profession: 'MagicalMonster', level: 35,
        collectibles: ['Feathered Cap'] }
];
exports.VenomCoating = VenomCoating;
