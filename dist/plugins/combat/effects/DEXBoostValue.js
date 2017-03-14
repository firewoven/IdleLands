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
var DEXBoostValue = (function (_super) {
    __extends(DEXBoostValue, _super);
    function DEXBoostValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DEXBoostValue.prototype.affect = function (target) {
        this.setStat(target, 'dex', this.potency);
    };
    return DEXBoostValue;
}(effect_1.Effect));
exports.DEXBoostValue = DEXBoostValue;
