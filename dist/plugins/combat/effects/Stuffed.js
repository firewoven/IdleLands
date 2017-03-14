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
var effect_1 = require("../effect");
var Stuffed = (function (_super) {
    __extends(Stuffed, _super);
    function Stuffed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stuffed.prototype.affect = function (target) {
        var _this = this;
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = this.target.fullname + " is stuffed!";
        var newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
        _.each(newStats, function (val, stat) {
            _this.setStat(target, stat, val);
        });
    };
    Stuffed.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = this.target.fullname + " is stuffed!";
    };
    return Stuffed;
}(effect_1.Effect));
exports.Stuffed = Stuffed;
