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
var PercentageHPHeal_1 = require("../effects/PercentageHPHeal");
var PaleMoonlight = (function (_super) {
    __extends(PaleMoonlight, _super);
    function PaleMoonlight() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PaleMoonlight.shouldCast = function (caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
    };
    PaleMoonlight.prototype.determineTargets = function () {
        return this.$targetting.allAllies;
    };
    PaleMoonlight.prototype.calcDuration = function () {
        return 5;
    };
    PaleMoonlight.prototype.calcPotency = function () {
        return this.spellPower;
    };
    PaleMoonlight.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins singing %spellName at %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: PercentageHPHeal_1.PercentageHPHeal,
                targets: [target]
            });
        });
    };
    return PaleMoonlight;
}(spell_1.Spell));
PaleMoonlight.element = spell_1.SpellType.BUFF;
PaleMoonlight.tiers = [
    { name: 'Through the Pale Moonlight', spellPower: 3, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'Shining Bright Against the Night', spellPower: 7.5, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.PaleMoonlight = PaleMoonlight;
