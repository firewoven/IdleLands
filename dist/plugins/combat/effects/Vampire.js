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
var Vampire = (function (_super) {
    __extends(Vampire, _super);
    function Vampire(opts) {
        var _this = this;
        if (!opts.duration)
            opts.duration = 3;
        _this = _super.call(this, opts) || this;
        return _this;
    }
    Vampire.prototype.affect = function () {
        this._emitMessage(this.target, '%player is slowly being drained of %hisher hp!');
    };
    Vampire.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var damage = Math.round(this.target.hp * 0.01 * this.potency);
        if (this.target.$isBoss) {
            damage = Math.round(damage / 4);
        }
        var casterAlive = this.origin.ref.hp !== 0;
        var message = "%player suffered %damage damage from %casterName's %spellName! " + (casterAlive ? '%casterName leeched it back!' : '');
        var dealtDamage = this.dealDamage(this.target, damage, message);
        if (casterAlive) {
            this.target.$battle.healDamage(this.origin.ref, dealtDamage, this.target);
        }
    };
    return Vampire;
}(effect_1.Effect));
exports.Vampire = Vampire;
