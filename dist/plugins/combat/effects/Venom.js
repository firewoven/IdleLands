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
var Venom = (function (_super) {
    __extends(Venom, _super);
    function Venom(opts) {
        var _this = this;
        if (!opts.duration)
            opts.duration = 5;
        _this = _super.call(this, opts) || this;
        return _this;
    }
    Venom.prototype.affect = function () {
        this._emitMessage(this.target, '%player had a dangerous venom injected into %hisher veins!');
    };
    Venom.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var damage = Math.round(this.target.hp * 0.02 * this.potency);
        if (this.target.$isBoss) {
            damage = Math.round(damage / 4);
        }
        var message = '%player suffered %damage damage from %casterName\'s %spellName!';
        this.dealDamage(this.target, damage, message);
    };
    return Venom;
}(effect_1.Effect));
exports.Venom = Venom;
