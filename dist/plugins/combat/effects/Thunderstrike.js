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
var Thunderstrike = (function (_super) {
    __extends(Thunderstrike, _super);
    function Thunderstrike() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Thunderstrike.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this._emitMessage(this.target, 'A storm brews over %player...');
    };
    Thunderstrike.prototype.unaffect = function () {
        var damage = this.potency * this._duration;
        this.dealDamage(this.target, damage, '%player got struck by %casterName\'s %spellName and took %damage damage!');
    };
    return Thunderstrike;
}(effect_1.Effect));
exports.Thunderstrike = Thunderstrike;
