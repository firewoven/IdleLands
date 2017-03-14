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
var RelentlessAssault_1 = require("../effects/RelentlessAssault");
var RelentlessAssault = (function (_super) {
    __extends(RelentlessAssault, _super);
    function RelentlessAssault() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelentlessAssault.shouldCast = function (caster) {
        return caster._special.gtePercent(70);
    };
    RelentlessAssault.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    RelentlessAssault.prototype.calcDuration = function () {
        return 10;
    };
    RelentlessAssault.prototype.calcPotency = function () {
        return 1;
    };
    RelentlessAssault.prototype.preCast = function () {
        var _this = this;
        var message = '%player begins a %spellName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                applyEffect: RelentlessAssault_1.RelentlessAssault,
                targets: [target]
            });
        });
    };
    return RelentlessAssault;
}(spell_1.Spell));
RelentlessAssault.element = spell_1.SpellType.PHYSICAL;
RelentlessAssault.stat = 'special';
RelentlessAssault.tiers = [
    { name: 'relentless assault', spellPower: 1, weight: 30, cost: 0, level: 50, profession: 'Archer' }
];
exports.RelentlessAssault = RelentlessAssault;
