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
var effect_1 = require("../effect");
var PercentageHPHeal = (function (_super) {
    __extends(PercentageHPHeal, _super);
    function PercentageHPHeal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PercentageHPHeal.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var healedHp = Math.round(this.target._hp.maximum * this.potency / 100);
        this.target.$battle.healDamage(this.target, healedHp, this.origin.ref);
        this._emitMessage(this.target, "%player was healed for " + healedHp + " hp by %casterName's %spellName!");
    };
    return PercentageHPHeal;
}(effect_1.Effect));
exports.PercentageHPHeal = PercentageHPHeal;
