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
var STRLoss = (function (_super) {
    __extends(STRLoss, _super);
    function STRLoss() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    STRLoss.prototype.affect = function (target) {
        this.setStat(target, 'str', -this.statByPercent(target, 'str', this.potency));
    };
    return STRLoss;
}(effect_1.Effect));
exports.STRLoss = STRLoss;
