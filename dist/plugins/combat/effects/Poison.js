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
var Poison = (function (_super) {
    __extends(Poison, _super);
    function Poison(opts) {
        var _this = this;
        if (!opts.duration)
            opts.duration = 5;
        _this = _super.call(this, opts) || this;
        return _this;
    }
    Poison.prototype.affect = function () {
        this._emitMessage(this.target, '%player was poisoned!');
    };
    Poison.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var damage = Math.round(this.origin.ref.liveStats.int * Math.log(this.potency + 1) / 6); // ln(x+1)/6 * int
        if (damage > 0) {
            var message = '%player suffered %damage damage from %casterName\'s %spellName!';
            this.dealDamage(this.target, damage, message);
        }
        else {
            this._emitMessage(this.target, '%casterName\'s %spellName was ineffective against %player!');
        }
    };
    return Poison;
}(effect_1.Effect));
exports.Poison = Poison;
