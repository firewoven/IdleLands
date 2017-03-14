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
var DoS = (function (_super) {
    __extends(DoS, _super);
    function DoS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DoS.prototype.affect = function () {
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = this.target.fullname + " is dropping packets!";
    };
    DoS.prototype.tick = function () {
        _super.prototype.tick.call(this);
        this.stun = effect_1.Effect.chance.bool({ likelihood: this.potency });
        this.stunMessage = this.target.fullname + " is dropping packets!";
    };
    return DoS;
}(effect_1.Effect));
exports.DoS = DoS;
