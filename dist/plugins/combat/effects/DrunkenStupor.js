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
var DrunkenStupor = (function (_super) {
    __extends(DrunkenStupor, _super);
    function DrunkenStupor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DrunkenStupor.prototype.affect = function () {
        this.stun = this.target.$drunk.gtePercent(50) && effect_1.Effect.chance.bool({ likelihood: 75 });
        this.stunMessage = this.target.fullname + " falls into a drunken stupor!";
    };
    DrunkenStupor.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.target.$drunk.sub(25);
        this.stun = this.target.$drunk.gtePercent(50) && effect_1.Effect.chance.bool({ likelihood: 75 });
        this.stunMessage = this.target.fullname + " is too drunk to act!";
    };
    DrunkenStupor.prototype.unaffect = function () {
        _super.prototype.unaffect.call(this);
        this.target.$drunk.toMinimum();
    };
    return DrunkenStupor;
}(effect_1.Effect));
exports.DrunkenStupor = DrunkenStupor;
