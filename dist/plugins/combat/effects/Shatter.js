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
var Shatter = (function (_super) {
    __extends(Shatter, _super);
    function Shatter(opts) {
        var _this = this;
        if (!opts.duration)
            opts.duration = 5;
        _this = _super.call(this, opts) || this;
        return _this;
    }
    Shatter.prototype.affect = function (target) {
        var _this = this;
        _.each(['str', 'dex', 'con'], function (stat) {
            _this.setStat(target, 'agi', -_this.statByPercent(target, stat, _this.potency * 10));
        });
        this._emitMessage(this.target, '%player\'s defenses were shattered!');
    };
    return Shatter;
}(effect_1.Effect));
exports.Shatter = Shatter;
