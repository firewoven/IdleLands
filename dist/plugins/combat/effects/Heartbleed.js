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
var Heartbleed = (function (_super) {
    __extends(Heartbleed, _super);
    function Heartbleed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Heartbleed.prototype.affect = function () {
        this._emitMessage(this.target, '%player\'s heart begins bleeding!');
    };
    Heartbleed.prototype.tick = function () {
        _super.prototype.tick.call(this);
        var damage = Math.round(this.target._hp.maximum * 0.07);
        var message = '%player suffered %damage damage from %casterName\'s %spellName!';
        this.dealDamage(this.target, damage, message);
    };
    return Heartbleed;
}(effect_1.Effect));
exports.Heartbleed = Heartbleed;
