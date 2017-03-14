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
var FlipTheBit = (function (_super) {
    __extends(FlipTheBit, _super);
    function FlipTheBit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlipTheBit.shouldCast = function (caster) {
        return this.$canTarget.anyBitFlippable(caster);
    };
    FlipTheBit.prototype.determineTargets = function () {
        return this.$targetting.randomBitFlippable;
    };
    FlipTheBit.prototype.preCast = function () {
        var _this = this;
        var message = '%player executed %spellName on %targetName!';
        var targets = this.determineTargets();
        _.each(targets, function (target) {
            var hp = target.hp;
            var mp = target.mp || 1;
            target._hp.set(mp);
            target._mp.set(hp);
            _super.prototype.cast.call(_this, {
                damage: 0,
                message: message,
                targets: [target]
            });
        });
    };
    return FlipTheBit;
}(spell_1.Spell));
FlipTheBit.element = spell_1.SpellType.DIGITAL;
FlipTheBit.stat = 'special';
FlipTheBit.tiers = [
    { name: 'flip the bit', spellPower: 1, weight: 40, cost: 512, level: 1, profession: 'Bitomancer' }
];
exports.FlipTheBit = FlipTheBit;
