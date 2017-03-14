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
var TakeAim = (function (_super) {
    __extends(TakeAim, _super);
    function TakeAim() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TakeAim.shouldCast = function (caster) {
        return caster._special.ltePercent(50);
    };
    TakeAim.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    TakeAim.prototype.calcDamage = function () {
        return this.spellPower;
    };
    TakeAim.prototype.preCast = function () {
        var _this = this;
        var restoredFocus = this.calcDamage();
        var message = "%player used %spellName and recovered " + restoredFocus + " focus!";
        var targets = this.determineTargets();
        this.caster._special.add(restoredFocus);
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                targets: [target]
            });
        });
    };
    return TakeAim;
}(spell_1.Spell));
TakeAim.element = spell_1.SpellType.PHYSICAL;
TakeAim.tiers = [
    { name: 'take aim', spellPower: 35, weight: 30, cost: 50, level: 7, profession: 'Archer' },
    { name: 'trance focus', spellPower: 70, weight: 30, cost: 250, level: 65, profession: 'Archer' }
];
exports.TakeAim = TakeAim;
