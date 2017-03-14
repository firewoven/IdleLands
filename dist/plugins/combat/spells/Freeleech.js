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
var Freeleech = (function (_super) {
    __extends(Freeleech, _super);
    function Freeleech() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Freeleech.shouldCast = function (caster) {
        return caster._special.ltePercent(30);
    };
    Freeleech.prototype.determineTargets = function () {
        return this.$targetting.allAlive;
    };
    Freeleech.prototype.calcDamage = function () {
        var min = this.caster.liveStats.dex / 4;
        var max = this.caster.liveStats.dex / 2;
        return this.minMax(min, max) * this.spellPower;
    };
    Freeleech.prototype.preCast = function () {
        var _this = this;
        var targets = this.determineTargets();
        var message = '%player started a %spellName, stealing %bandwidth bandwidth from %targetName!';
        _.each(targets, function (target) {
            if (target === _this.caster)
                return;
            var isTargetBito = target.professionName === 'Bitomancer';
            var bandwidthStolen = isTargetBito ? Math.round(target.special / 10) : Math.round(_this.caster._special.maximum / 15);
            if (isTargetBito) {
                target._special.sub(bandwidthStolen);
            }
            _this.caster._special.add(bandwidthStolen);
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                messageData: { bandwidth: bandwidthStolen },
                targets: [target]
            });
        });
    };
    return Freeleech;
}(spell_1.Spell));
Freeleech.element = spell_1.SpellType.DIGITAL;
Freeleech.stat = 'special';
Freeleech.tiers = [
    { name: 'freeleech', spellPower: 1, weight: 10, cost: 0, level: 1, profession: 'Bitomancer' }
];
exports.Freeleech = Freeleech;
