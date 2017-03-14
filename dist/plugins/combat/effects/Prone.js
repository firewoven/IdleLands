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
var Prone = (function (_super) {
    __extends(Prone, _super);
    function Prone(opts) {
        var _this = this;
        if (!opts.duration)
            opts.duration = 1;
        _this = _super.call(this, opts) || this;
        return _this;
    }
    Prone.prototype.affect = function () {
        this.stun = !this.target.$isBoss;
        this.stunMessage = this.target.fullname + " is stunned!";
        this._emitMessage(this.target, '%player was knocked prone!');
    };
    Prone.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.stun = !this.target.$isBoss;
        this.stunMessage = this.target.fullname + " is stunned!";
    };
    return Prone;
}(effect_1.Effect));
exports.Prone = Prone;
